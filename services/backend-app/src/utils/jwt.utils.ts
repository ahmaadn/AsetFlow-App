import { verifyJWT, signJWT, decodeJWT, isExpired } from '@asetflow/shared';
import type { AccessTokenPayload, RefreshTokenPayload } from '@asetflow/shared';
import type { JWTPayload } from 'jose';

import { jwtConfig } from '../configs/jwt.config.js';
import { logger } from '../configs/logger.config.js';

export class JWTService {
  /**
   * Generate access token with 15 minutes expiration
   */
  async generateAccessToken(payload: {
    userId: string;
    email: string;
    role: string;
  }): Promise<string> {
    const jwtPayload: AccessTokenPayload = {
      ...payload,
      type: 'access',
      iss: jwtConfig.issuer,
      aud: jwtConfig.audience,
    };

    return await signJWT({
      payload: jwtPayload,
      privateKey: jwtConfig.privateKey,
      exp: jwtConfig.accessTokenExpiration,
      aud: jwtConfig.audience,
      iss: jwtConfig.issuer,
    });
  }

  /**
   * Generate refresh token with 7 days expiration
   */
  async generateRefreshToken(payload: {
    userId: string;
    tokenId: string;
  }): Promise<string> {
    const jwtPayload: RefreshTokenPayload = {
      ...payload,
      type: 'refresh',
      iss: jwtConfig.issuer,
      aud: jwtConfig.audience,
    };

    return await signJWT({
      payload: jwtPayload,
      privateKey: jwtConfig.privateKey,
      exp: jwtConfig.refreshTokenExpiration,
      aud: jwtConfig.audience,
      iss: jwtConfig.issuer,
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  async generateTokenPair(payload: {
    userId: string;
    email: string;
    role: string;
    tokenId: string;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      }),
      this.generateRefreshToken({
        userId: payload.userId,
        tokenId: payload.tokenId,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify access token, ensure it's valid and this method does not check token expiration
   */
  async verifyAccessToken(token: string): Promise<AccessTokenPayload | false> {
    try {
      const payload = await verifyJWT<AccessTokenPayload>({
        token,
        publicKey: jwtConfig.publicKey,
        expectedIssuer: jwtConfig.issuer,
        expectedAudience: jwtConfig.audience,
      });

      logger.debug('Verified access token payload');

      if (!payload || payload.type !== 'access') {
        logger.warn('Access token type mismatch or invalid payload');
        return false;
      }

      return payload;
    } catch (error) {
      logger.error('Error verifying access token:', error);
      return false;
    }
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(
    token: string
  ): Promise<RefreshTokenPayload | false> {
    try {
      const payload = await verifyJWT<RefreshTokenPayload>({
        token,
        publicKey: jwtConfig.publicKey,
        expectedIssuer: jwtConfig.issuer,
        expectedAudience: jwtConfig.audience,
      });

      if (!payload || payload.type !== 'refresh') {
        return false;
      }

      return payload;
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT without verification (use carefully)
   */
  decodeToken<T extends JWTPayload>(token: string): T {
    return decodeJWT<T>(token);
  }

  /**
   * Check if JWT is valid (not expired)
   */
  async isValidToken(token: string): Promise<boolean> {
    return (
      (await verifyJWT({
        token,
        publicKey: jwtConfig.publicKey,
        expectedIssuer: jwtConfig.issuer,
        expectedAudience: jwtConfig.audience,
      })) !== false
    );
  }

  isTokenExpired(payload: string | JWTPayload): boolean {
    return isExpired(payload);
  }

  async generateVerificationToken(
    type: string,
    payload: {
      userId: string;
      email: string;
    }
  ): Promise<string> {
    const jwtPayload = {
      ...payload,
      type,
      iss: jwtConfig.issuer,
      aud: jwtConfig.audience,
    };

    return await signJWT({
      payload: jwtPayload,
      privateKey: jwtConfig.privateKey,
      exp: '1h', // Verification tokens expire in 1 hour
      aud: jwtConfig.audience,
      iss: jwtConfig.issuer,
    });
  }

  async verifyVerificationToken(token: string, expectedType: string) {
    try {
      const payload = await verifyJWT<AccessTokenPayload>({
        token,
        publicKey: jwtConfig.publicKey,
        expectedIssuer: jwtConfig.issuer,
        expectedAudience: jwtConfig.audience,
      });

      logger.debug('Verified access token payload');

      if (!payload || payload.type !== expectedType) {
        logger.warn('Access token type mismatch or invalid payload');
        return false;
      }

      return payload;
    } catch (error) {
      logger.error('Error verifying access token:', error);
      return false;
    }
  }
}

// Export singleton instance
export const jwtService = new JWTService();
