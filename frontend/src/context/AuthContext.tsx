import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, UserRole, LoginCredentials, RegisterCredentials } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: 'canViewDashboard' | 'canAnalyze' | 'canManageUsers' | 'canDeleteReports' | 'canSubmitReports') => boolean;
  switchDemoUser: (role: 'ADMIN' | 'HSE_ANALYST' | 'REPORTER') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo User Presets for Hackathon / Demonstration
export const DEMO_USERS = {
  ADMIN: {
    email: 'admin@oil.com',
    password: 'Password123!',
    label: 'Safety Admin',
    role: 'ADMIN' as UserRole,
    description: 'Full administrative access, user management, all facilities',
  },
  HSE_ANALYST: {
    email: 'analyst@oil.com',
    password: 'Password123!',
    label: 'HSE Safety Analyst',
    role: 'ANALYST' as UserRole,
    description: 'Dashboard analytics, AI SIF evaluation, cross-report patterns',
  },
  REPORTER: {
    email: 'reviewer@oil.com',
    password: 'Password123!',
    label: 'Field Safety Reporter',
    role: 'REVIEWER' as UserRole,
    description: 'Submit observations, track report status, my reports',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [token, setToken] = useState<string | null>(() => authService.getStoredAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = authService.getStoredAccessToken();
      if (storedToken) {
        const currentUser = await authService.getMe();
        if (currentUser) {
          setUser(currentUser);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } else {
        // Automatically sign in default HSE Analyst if no session exists for smooth evaluation
        try {
          const res = await authService.login({
            email: DEMO_USERS.HSE_ANALYST.email,
            password: DEMO_USERS.HSE_ANALYST.password,
          });
          setUser(res.user);
          setToken(res.accessToken);
        } catch {
          setUser(null);
          setToken(null);
        }
      }
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      setToken(res.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const res = await authService.register(credentials);
      setUser(res.user);
      setToken(res.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Admin has all roles

    const roles = Array.isArray(role) ? role : [role];
    const normalizedUserRole = user.role;

    return roles.some((r) => {
      if (r === 'HSE_ANALYST') {
        return normalizedUserRole === 'ANALYST' || normalizedUserRole === 'MANAGER' || normalizedUserRole === 'HSE_ANALYST';
      }
      if (r === 'REPORTER') {
        return normalizedUserRole === 'REVIEWER' || normalizedUserRole === 'REPORTER';
      }
      return normalizedUserRole === r;
    });
  }, [user]);

  const hasPermission = useCallback((permission: 'canViewDashboard' | 'canAnalyze' | 'canManageUsers' | 'canDeleteReports' | 'canSubmitReports'): boolean => {
    if (!user) return false;
    const role = user.role;

    switch (permission) {
      case 'canManageUsers':
      case 'canDeleteReports':
        return role === 'ADMIN';
      case 'canViewDashboard':
      case 'canAnalyze':
        return role === 'ADMIN' || role === 'ANALYST' || role === 'MANAGER' || role === 'HSE_ANALYST';
      case 'canSubmitReports':
        return true; // All roles can submit reports
      default:
        return false;
    }
  }, [user]);

  const switchDemoUser = async (roleKey: 'ADMIN' | 'HSE_ANALYST' | 'REPORTER') => {
    const preset = DEMO_USERS[roleKey];
    if (preset) {
      await login({
        email: preset.email,
        password: preset.password,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        hasPermission,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
