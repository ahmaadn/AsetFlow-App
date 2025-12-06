/**
 * Authentication Types
 *
 * Centralized type definitions for the authentication system.
 * This ensures type consistency across the entire auth flow.
 */

import type { Session, User } from '@asetflow/shared-types';

declare global {
  /**
   * Global authentication state interface
   */
  interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: Error | null;
  }

  /**
   * Login credentials interface
   */
  interface LoginCredentials {
    email: string;
    password: string;
  }

  /**
   * Registration data interface
   */
  interface RegisterData {
    name: string;
    email: string;
    password: string;
  }

  /**
   * Authentication result interface
   */
  interface AuthResult<T = any> {
    data?: T;
    error?: Error;
  }

  /**
   * Better Auth client session response
   */
  interface SessionResponse {
    data?: {
      session?: Session;
      user?: User;
    } | null;
    error?: Error;
  }

  /**
   * Better Auth authentication response
   */
  interface AuthResponse {
    data?: any;
    error?: {
      message: string;
      code?: string;
    };
  }
}

export {};
