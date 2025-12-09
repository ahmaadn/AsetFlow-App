import type { User } from '@asetflow/shared-types';
import { API_CONFIG } from '../config';

interface ApiError {
  message?: string;
  status?: number;
}

interface SessionData {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  } | null;
  user: User | null;
}

interface AuthResponse {
  data?: SessionData;
  error?: {
    message: string;
    code?: string;
  };
}

type OptionFetch = Omit<Parameters<typeof $fetch>[1], 'method'>;

export class AuthService {
  api: typeof $fetch;

  constructor() {
    this.api = useNuxtApp().$api;
  }

  /**
   * Manually fetch current session from the server
   * Replaces better-auth's getSession method
   *
   * @param options Additional fetch options
   * @returns Promise resolving to session data
   */
  async getSession(options: OptionFetch = {}): Promise<AuthResponse> {
    try {
      const response = await this.api<SessionData>(
        `${API_CONFIG.VERSION}/auth/session`,
        {
          method: 'GET',
          credentials: 'include',
          ...options,
        }
      );

      return {
        data: response,
      };
    } catch (error: unknown) {
      console.warn('Manual session fetch failed:', error);

      // Handle different error scenarios
      if (error?.status === 401) {
        return {
          data: {
            session: null,
            user: null,
          },
        };
      }

      return {
        error: {
          message: error?.message || 'Failed to fetch session',
          code: error?.status?.toString() || 'FETCH_ERROR',
        },
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(
    credentials: { email: string; password: string },
    options: OptionFetch = {}
  ) {
    try {
      const response = await this.api(`${API_CONFIG.VERSION}/auth/sign-in`, {
        method: 'POST',
        body: credentials,
        credentials: 'include',
        ...options,
      });

      return { data: response };
    } catch (error: unknown) {
      return {
        error: {
          message: (error as ApiError)?.message || 'Sign in failed',
          code: (error as ApiError)?.status?.toString() || 'SIGNIN_ERROR',
        },
      };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(
    userData: { name: string; email: string; password: string },
    options: OptionFetch = {}
  ) {
    try {
      const response = await this.api(`${API_CONFIG.VERSION}/auth/sign-up`, {
        method: 'POST',
        body: userData,
        credentials: 'include',
        ...options,
      });

      return { data: response };
    } catch (error: unknown) {
      return {
        error: {
          message: (error as ApiError)?.message || 'Sign up failed',
          code: (error as ApiError)?.status?.toString() || 'SIGNUP_ERROR',
        },
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(options: OptionFetch = {}) {
    try {
      const response = await this.api(`${API_CONFIG.VERSION}/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
        ...options,
      });

      return { data: response };
    } catch (error: unknown) {
      return {
        error: {
          message: (error as ApiError)?.message || 'Sign out failed',
          code: (error as ApiError)?.status?.toString() || 'SIGNOUT_ERROR',
        },
      };
    }
  }

  /**
   * Request password reset using better-auth endpoint directly
   */
  async forgotPassword(email: string, options: OptionFetch = {}) {
    try {
      const config = useRuntimeConfig();
      const baseURL = import.meta.server
        ? config.apiBaseServer || 'http://localhost:8000'
        : config.public.apiBase || 'http://localhost:8000';

      const response = await $fetch(`${baseURL}/v1/auth/forget-password`, {
        method: 'POST',
        body: {
          email,
          redirectTo: `${window?.location?.origin || 'http://localhost:3000'}/reset-password`,
        },
        credentials: 'include',
        ...options,
      });

      return { data: response };
    } catch (error: unknown) {
      return {
        error: {
          message:
            (error as ApiError)?.message || 'Password reset request failed',
          code:
            (error as ApiError)?.status?.toString() || 'FORGOT_PASSWORD_ERROR',
        },
      };
    }
  }

  /**
   * Reset password with token using better-auth endpoint directly
   */
  async resetPassword(
    token: string,
    password: string,
    options: OptionFetch = {}
  ) {
    try {
      const config = useRuntimeConfig();
      const baseURL = import.meta.server
        ? config.apiBaseServer || 'http://localhost:8000'
        : config.public.apiBase || 'http://localhost:8000';

      const response = await $fetch(`${baseURL}/v1/auth/reset-password`, {
        method: 'POST',
        body: { token, newPassword: password },
        credentials: 'include',
        ...options,
      });

      return { data: response };
    } catch (error: unknown) {
      return {
        error: {
          message: (error as ApiError)?.message || 'Password reset failed',
          code:
            (error as ApiError)?.status?.toString() || 'RESET_PASSWORD_ERROR',
        },
      };
    }
  }
}
