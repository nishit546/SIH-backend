export type UserRole =
  | 'ADMIN'
  | 'HSE_ANALYST'
  | 'REPORTER'
  | 'ANALYST'
  | 'MANAGER'
  | 'REVIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string | null;
  site?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
  site?: string;
}

export interface AuthResponsePayload {
  success: boolean;
  message?: string;
  accessToken: string;
  refreshToken: string;
  token?: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
