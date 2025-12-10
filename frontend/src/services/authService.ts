import api from './api';

export interface SignupData {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: 'owner' | 'client' | 'agent';
}

export interface LoginData {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    isVerified: boolean;
    profilePhotoUrl?: string;
  };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', data);
    return response.data.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  }

  async sendOTP(phone: string): Promise<void> {
    await api.post('/auth/otp/send', { phone });
  }

  async verifyOTP(phone: string, otp: string): Promise<void> {
    await api.post('/auth/otp/verify', { phone, otp });
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
}

export default new AuthService();
