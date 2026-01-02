import type { PayloadTokenResponse } from '@asetflow/shared-types';
import { API_CONFIG } from '../config';
import type { RegisterInput, ResetPasswordInput } from '@asetflow/validators';

export class AuthService {
  api: typeof $fetch;

  constructor() {
    this.api = useNuxtApp().$api;
  }

  async login(email: string, password: string) {
    return this.api<PayloadTokenResponse>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.AUTH}/login`,
      {
        method: 'POST',
        body: { email, password },
      }
    );
  }

  async register(data: RegisterInput) {
    return this.api<boolean>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.AUTH}/register`,
      {
        method: 'POST',
        body: data,
      }
    );
  }

  /**
   * Request password reset
   * @param email User's email address
   * @returns Success status
   */
  async forgetPassword({
    email,
    redirectUrl = `${window.location.origin}/reset-password`,
  }: {
    email: string;
    redirectUrl?: string;
  }) {
    return this.api<boolean>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.AUTH}/forget-password`,
      {
        method: 'POST',
        body: {
          email,
          redirectUrl,
        },
      }
    );
  }

  async resetPassword(data: ResetPasswordInput) {
    return this.api<boolean>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.AUTH}/reset-password`,
      {
        method: 'POST',
        body: data,
      }
    );
  }
}
