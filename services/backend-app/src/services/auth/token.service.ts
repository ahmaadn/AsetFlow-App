import type { AccessTokenResponse } from '@asetflow/shared-types';

import logger from '../../configs/logger.config.js';
import type { IRefreshTokenRepository } from '../../repositories/refresh-token.repository.js';
import * as JwtUtils from '../../utils/jwt.utils.js';

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
    const payload = await JwtUtils.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database and is not revoked
    const dbToken = await this.refreshTokenRepository.findActiveByToken(
      payload,
      refreshToken
    );

    if (!dbToken) {
      return null;
    }

    // Generate new access token
    const accessToken = await JwtUtils.createAccessToken({
      name: dbToken.user.name,
      userId: dbToken.user.id,
      email: dbToken.user.email,
      role: dbToken.user.role,
    });

    return {
      accessToken,
      expiresIn: 15 * 60, // 15 minutes
    };
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const payload = await JwtUtils.verifyRefreshToken(refreshToken);
      await this.refreshTokenRepository.revokeToken(payload, refreshToken);
      logger.info('Refresh token revoked successfully');
      return true;
    } catch {
      logger.error('Error revoking refresh token');
      return false;
    }
  }
}
