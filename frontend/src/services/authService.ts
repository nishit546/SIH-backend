import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponsePayload,
} from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'sif_auth_access_token';
const REFRESH_TOKEN_KEY = 'sif_auth_refresh_token';
const USER_KEY = 'sif_auth_user';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')
).replace(/\/$/, '');

class AuthService {
  getStoredAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  getStoredRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setSession(user: User, accessToken: string, refreshToken?: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist auth session to localStorage', e);
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Failed to clear auth session from localStorage', e);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponsePayload> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error?.message || 'Authentication failed. Please check credentials.');
    }

    const payload: AuthResponsePayload = {
      success: true,
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      user: data.user,
      message: data.message,
    };

    this.setSession(payload.user, payload.accessToken, payload.refreshToken);
    return payload;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponsePayload> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error?.message || 'Registration failed. Please review fields.');
    }

    const payload: AuthResponsePayload = {
      success: true,
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      user: data.user,
      message: data.message,
    };

    this.setSession(payload.user, payload.accessToken, payload.refreshToken);
    return payload;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getStoredRefreshToken();
    const accessToken = this.getStoredAccessToken();

    try {
      if (refreshToken || accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearSession();
    }
  }

  async getMe(): Promise<User | null> {
    const token = this.getStoredAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Attempt refresh
          const newToken = await this.refreshToken();
          if (newToken) {
            return this.getMe();
          }
          this.clearSession();
          return null;
        }
        return null;
      }

      const data = await response.json();
      const user: User = data.user || data.data?.user;
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      return user;
    } catch {
      return this.getStoredUser();
    }
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearSession();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken;
      const user = data.user || this.getStoredUser();

      if (newAccessToken && user) {
        this.setSession(user, newAccessToken, newRefreshToken);
        return newAccessToken;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
