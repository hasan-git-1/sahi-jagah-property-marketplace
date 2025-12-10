export interface User {
  id: string;
  role: 'owner' | 'client' | 'agent' | 'admin';
  name: string;
  email?: string;
  phone?: string;
  hashedPassword?: string;
  profilePhotoUrl?: string;
  isVerified: boolean;
  verificationDocs: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  status: 'active' | 'suspended' | 'deleted';
}

export interface CreateUserDto {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: 'owner' | 'client' | 'agent' | 'admin';
}

export interface LoginDto {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface OTPRecord {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}
