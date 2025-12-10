import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, auth as firebaseAuth } from '../config/firebase';
import { CreateUserDto, LoginDto, User, OTPRecord } from '../models/user';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../config/logger';
import { sendOTPEmail } from '../config/email';
import { sendOTPSMS } from '../config/sms';

const BCRYPT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// In-memory OTP storage (use Redis in production)
const otpStore = new Map<string, OTPRecord>();

// Token blacklist (use Redis in production)
const tokenBlacklist = new Set<string>();

export class AuthService {
  // Generate OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  // Verify password
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT tokens
  private generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      { userId, role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId, role }, 
      JWT_REFRESH_SECRET, 
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  // Verify JWT token
  public verifyToken(token: string): { userId: string; role: string } {
    try {
      if (tokenBlacklist.has(token)) {
        throw new AppError(401, 'AUTH_TOKEN_INVALID', 'Token has been revoked');
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, 'AUTH_TOKEN_EXPIRED', 'Token has expired');
      }
      throw new AppError(401, 'AUTH_TOKEN_INVALID', 'Invalid token');
    }
  }

  // Signup
  async signup(data: CreateUserDto): Promise<{ user: User; tokens: any }> {
    try {
      // Validate input
      if (!data.email && !data.phone) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Email or phone is required');
      }

      if (data.email && data.phone) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Provide either email or phone, not both');
      }

      // Check if user already exists
      const usersRef = db.collection('users');
      let existingUser;

      if (data.email) {
        existingUser = await usersRef.where('email', '==', data.email).limit(1).get();
        if (!existingUser.empty) {
          throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'Email is already registered');
        }
      }

      if (data.phone) {
        existingUser = await usersRef.where('phone', '==', data.phone).limit(1).get();
        if (!existingUser.empty) {
          throw new AppError(409, 'PHONE_ALREADY_REGISTERED', 'Phone is already registered');
        }
      }

      // Create Firebase Auth user
      let firebaseUser;
      if (data.email && data.password) {
        firebaseUser = await firebaseAuth.createUser({
          email: data.email,
          password: data.password,
        });
      } else if (data.phone) {
        firebaseUser = await firebaseAuth.createUser({
          phoneNumber: data.phone.startsWith('+') ? data.phone : `+91${data.phone}`,
        });
      } else {
        throw new AppError(400, 'VALIDATION_FAILED', 'Password required for email signup');
      }

      // Hash password if provided
      let hashedPassword;
      if (data.password) {
        hashedPassword = await this.hashPassword(data.password);
      }

      // Create user document in Firestore
      const user: Omit<User, 'id'> = {
        role: data.role,
        name: data.name,
        email: data.email,
        phone: data.phone,
        hashedPassword,
        isVerified: false,
        verificationDocs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
        },
        status: 'active',
      };

      await usersRef.doc(firebaseUser.uid).set(user);

      const createdUser: User = {
        id: firebaseUser.uid,
        ...user,
      };

      // Generate tokens
      const tokens = this.generateTokens(firebaseUser.uid, data.role);

      logger.info(`User created successfully: ${firebaseUser.uid}`);

      return { user: createdUser, tokens };
    } catch (error) {
      logger.error('Signup error:', error);
      throw error;
    }
  }

  // Login
  async login(data: LoginDto): Promise<{ user: User; tokens: any }> {
    try {
      // Validate input
      if (!data.email && !data.phone) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Email or phone is required');
      }

      if (data.email && !data.password) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Password required for email login');
      }

      if (data.phone && !data.otp) {
        throw new AppError(400, 'VALIDATION_FAILED', 'OTP required for phone login');
      }

      // Find user
      const usersRef = db.collection('users');
      let userSnapshot;

      if (data.email) {
        userSnapshot = await usersRef.where('email', '==', data.email).limit(1).get();
      } else if (data.phone) {
        userSnapshot = await usersRef.where('phone', '==', data.phone).limit(1).get();
      }

      if (!userSnapshot || userSnapshot.empty) {
        throw new AppError(401, 'AUTH_CREDENTIALS_INVALID', 'Invalid credentials');
      }

      const userDoc = userSnapshot.docs[0];
      const user = { id: userDoc.id, ...userDoc.data() } as User;

      // Check if user is active
      if (user.status !== 'active') {
        throw new AppError(403, 'FORBIDDEN_OPERATION', 'Account is suspended or deleted');
      }

      // Verify credentials
      if (data.email && data.password) {
        if (!user.hashedPassword) {
          throw new AppError(401, 'AUTH_CREDENTIALS_INVALID', 'Invalid credentials');
        }

        const isValidPassword = await this.verifyPassword(data.password, user.hashedPassword);
        if (!isValidPassword) {
          throw new AppError(401, 'AUTH_CREDENTIALS_INVALID', 'Invalid credentials');
        }
      } else if (data.phone && data.otp) {
        const isValidOTP = await this.verifyOTP(data.phone, data.otp);
        if (!isValidOTP) {
          throw new AppError(401, 'AUTH_OTP_INVALID', 'Invalid or expired OTP');
        }
      }

      // Update last login
      await usersRef.doc(user.id).update({
        lastLoginAt: new Date(),
      });

      // Generate tokens
      const tokens = this.generateTokens(user.id, user.role);

      logger.info(`User logged in successfully: ${user.id}`);

      return { user, tokens };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Send OTP
  async sendOTP(phone: string): Promise<void> {
    try {
      // Format phone number
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

      // Check rate limiting (max 3 OTPs per hour per phone)
      const existingOTP = otpStore.get(formattedPhone);
      if (existingOTP && existingOTP.attempts >= 3) {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (existingOTP.expiresAt > hourAgo) {
          throw new AppError(429, 'RATE_LIMIT_EXCEEDED', 'Too many OTP requests. Try again later.');
        }
      }

      // Generate OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP
      otpStore.set(formattedPhone, {
        phone: formattedPhone,
        otp,
        expiresAt,
        attempts: (existingOTP?.attempts || 0) + 1,
      });

      // Send OTP via SMS
      await sendOTPSMS(formattedPhone, otp);

      // Also send via email if user has email
      const usersRef = db.collection('users');
      const userSnapshot = await usersRef.where('phone', '==', formattedPhone).limit(1).get();
      if (!userSnapshot.empty) {
        const user = userSnapshot.docs[0].data() as User;
        if (user.email) {
          await sendOTPEmail(user.email, otp);
        }
      }

      logger.info(`OTP sent to ${formattedPhone}`);
    } catch (error) {
      logger.error('Send OTP error:', error);
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const otpRecord = otpStore.get(formattedPhone);

    if (!otpRecord) {
      return false;
    }

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {
      otpStore.delete(formattedPhone);
      return false;
    }

    // Verify OTP
    if (otpRecord.otp === otp) {
      otpStore.delete(formattedPhone);
      return true;
    }

    return false;
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        userId: string;
        role: string;
      };

      // Generate new tokens
      const tokens = this.generateTokens(decoded.userId, decoded.role);

      return tokens;
    } catch (error) {
      throw new AppError(401, 'AUTH_TOKEN_INVALID', 'Invalid refresh token');
    }
  }

  // Logout
  async logout(token: string): Promise<void> {
    tokenBlacklist.add(token);
    logger.info('User logged out');
  }
}

export default new AuthService();
