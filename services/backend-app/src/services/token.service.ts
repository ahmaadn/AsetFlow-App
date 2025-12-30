import { AccessTokenResponse } from '@asetflow/shared-types';

import type { IRefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { jwtService } from '../utils/jwt.utils.js';

/**
 * Authentication Token Service
 */
export class AuthTokenService {
  public refreshTokenRepository: IRefreshTokenRepository;

  constructor(refreshTokenRepository: IRefreshTokenRepository) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<AccessTokenResponse | null> {
    // Verify JWT first
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    // Check if refresh token exists in database and is not revoked
    const dbToken = await this.refreshTokenRepository.findActiveByToken(
      payload,
      refreshToken
    );

    if (!dbToken) {
      return null;
    }

    // Generate new access token
    const accessToken = await jwtService.generateAccessToken({
      userId: dbToken.user.id,
      email: dbToken.user.email,
      role: dbToken.user.role,
    });

    return {
      accessToken,
      expiresIn: 15 * 60, // 15 minutes
      user: {
        id: dbToken.user.id,
        email: dbToken.user.email,
        role: dbToken.user.role,
      },
    };
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const payload = await jwtService.verifyRefreshToken(refreshToken);
      if (!payload) {
        return false;
      }

      await this.refreshTokenRepository.revokeToken(payload, refreshToken);
      return true;
    } catch {
      return false;
    }
  }
}
