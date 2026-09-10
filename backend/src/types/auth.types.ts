import { UserRole } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  jti?: string;
}

export interface AuthenticatedUser {
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
}

export interface AuthResponse extends AuthTokens {
  success: boolean;
  message?: string;
  user: AuthenticatedUser;
}
