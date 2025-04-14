import { User } from './user';

export interface LoginData {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
