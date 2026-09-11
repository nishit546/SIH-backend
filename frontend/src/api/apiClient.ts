/**
 * Centralized API Client for HSE Safety Intelligence Platform.
 *
 * Provides standardized HTTP request handling, response parsing,
 * JWT authentication header injection, transparent token refresh on 401,
 * network error normalization, and user-friendly error messages.
 */
import { authService } from '../services/authService';

export class ApiError extends Error {
  public status: number;
  public details?: unknown;
  public code?: string;

  constructor(message: string, status: number = 500, details?: unknown, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

// Configurable base URL via environment variable with fallback
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')
).replace(/\/$/, '');

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
  _retry?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Normalizes backend / HTTP error status into user-friendly HSE messages.
 */
function normalizeErrorMessage(status: number, data: any, defaultMsg: string): string {
  if (data?.error?.message) {
    return data.error.message;
  }
  if (data?.message) {
    return data.message;
  }

  switch (status) {
    case 400:
      return 'The submitted safety report data was invalid. Please review required fields and try again.';
    case 401:
      return 'Authentication required. Please log in to access this HSE resource.';
    case 403:
      return 'Access denied. Your user role does not have permission to view or perform this action.';
    case 404:
      return 'The requested safety report or record was not found in the database.';
    case 409:
      return 'A conflict occurred while processing this safety record.';
    case 502:
    case 503:
      return 'The AI reasoning pipeline is currently unavailable. Please try again shortly.';
    case 504:
      return 'The request timed out while analyzing the safety report.';
    case 500:
      return 'An internal server error occurred. The HSE system operations team has been notified.';
    default:
      return defaultMsg || 'An unexpected error occurred while communicating with the safety server.';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { timeoutMs = 25000, params, _retry = false, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Setup abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Inject JWT Bearer Token if available
  const token = authService.getStoredAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Try parsing JSON
    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { message: text };
      }
    }

    // Handle 401 Unauthorized with automatic transparent refresh retry once
    if (response.status === 401 && !_retry && !endpoint.includes('/auth/')) {
      const newToken = await authService.refreshToken();
      if (newToken) {
        return apiRequest<T>(endpoint, { ...options, _retry: true });
      }
    }

    if (!response.ok) {
      const friendlyMessage = normalizeErrorMessage(
        response.status,
        responseData,
        response.statusText
      );
      throw new ApiError(friendlyMessage, response.status, responseData);
    }

    return responseData as ApiResponse<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The safety analysis engine took too long to respond.',
        504
      );
    }

    // Network / Offline error
    throw new ApiError(
      'Unable to connect to the HSE backend server. Please verify your connection or check if the server is running.',
      0,
      err
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: RequestOptions['params'], options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', params, ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),

  getBaseUrl: () => API_BASE_URL
};
