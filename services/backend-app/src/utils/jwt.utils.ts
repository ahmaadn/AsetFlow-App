import {
  verifyJWT,
  signJWT,
  decodeJWT,
  isExpired,
  ErrorCode,
} from '@asetflow/shared';
import type { AccessTokenPayload, RefreshTokenPayload } from '@asetflow/shared';
import {
  AccessTokenCredentials,
  RefreshTokenCredentials,
} from '@asetflow/shared-types';
import type { JWTPayload } from 'jose';
import { JWTExpired } from 'jose/errors';

import { UnauthorizedError } from './api-error.js';
import { jwtConfig } from '../configs/jwt.config.js';
import logger from '../configs/logger.config.js';

/**
 * Generate access token with custom payload (Generic)
 */
export async function createAccessToken<T extends AccessTokenCredentials>(
  payload: T,
  expiresIn: string | number | Date = jwtConfig.accessTokenExpiration
): Promise<string> {
  const jwtPayload: AccessTokenPayload<T> = {
    ...payload,
    type: 'access' as const,
    iss: jwtConfig.issuer,
    aud: jwtConfig.audience,
  };

  return await signJWT({
    payload: jwtPayload,
    privateKey: jwtConfig.privateKey,
    exp: expiresIn,
    aud: jwtConfig.audience,
    iss: jwtConfig.issuer,
  });
}

/**
 * Generate refresh token with custom payload
 */
export async function createRefreshToken<T extends RefreshTokenCredentials>(
  payload: T,
  expiresIn: string | number | Date = jwtConfig.refreshTokenExpiration
): Promise<string> {
  const jwtPayload: RefreshTokenPayload<T> = {
    ...payload,
    type: 'refresh' as const,
    iss: jwtConfig.issuer,
    aud: jwtConfig.audience,
  };

  return await signJWT({
    payload: jwtPayload,
    privateKey: jwtConfig.privateKey,
    exp: expiresIn,
    aud: jwtConfig.audience,
    iss: jwtConfig.issuer,
  });
}

/**
 * Generate both access and refresh tokens
 */
export async function createTokenPair<
  TAccess extends AccessTokenCredentials,
  TRefresh extends RefreshTokenCredentials,
>(payload: { access: TAccess; refresh: TRefresh }) {
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(payload.access),
    createRefreshToken(payload.refresh),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Verify access token with custom payload type (Generic)
 */
export async function verifyAccessToken<T extends AccessTokenCredentials>(
  token: string
): Promise<AccessTokenPayload<T>> {
  try {
    const payload = await verifyJWT<AccessTokenPayload<T>>({
      token,
      publicKey: jwtConfig.publicKey,
      expectedIssuer: jwtConfig.issuer,
      expectedAudience: jwtConfig.audience,
    });

    logger.debug('Verified access token payload');
    logger.debug('Access Token Payload:', payload);

    if (payload.type !== 'access') {
      logger.warn('Access token type mismatch or invalid payload');
      throw new UnauthorizedError({
        message: 'Invalid token type',
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    return payload;
  } catch (error) {
    if (error instanceof JWTExpired) {
      logger.error('Access token has expired');
      throw new UnauthorizedError({
        message: 'Token expired',
        errorCode: ErrorCode.TOKEN_EXPIRED,
      });
    }
    logger.error('Error verifying access token:', error);
    // re-throw as UnauthorizedError
    throw new UnauthorizedError({
      message: 'Invalid or expired token',
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }
}

/**
 * Verify refresh token with custom payload type (Generic)
 * @example
 * const payload = await verifyRefreshToken<{ userId: string; tokenId: string; deviceId: string }>(token)
 */
export async function verifyRefreshToken<
  T extends { userId: string; tokenId: string } = {
    userId: string;
    tokenId: string;
  },
>(token: string): Promise<RefreshTokenPayload<T>> {
  try {
    const payload = await verifyJWT<RefreshTokenPayload<T>>({
      token,
      publicKey: jwtConfig.publicKey,
      expectedIssuer: jwtConfig.issuer,
      expectedAudience: jwtConfig.audience,
    });
    logger.debug('Verified refresh token payload');

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError({
        message: 'Invalid or expired token',
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    return payload;
  } catch {
    // re-throw as UnauthorizedError
    throw new UnauthorizedError({
      message: 'Invalid or expired token',
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }
}

/**
 * Decode JWT without verification (use carefully)
 */
export function decodeToken<T extends JWTPayload>(token: string): T {
  return decodeJWT<T>(token);
}

/**
 * Check if JWT is valid (not expired)
 */
export async function isValidToken(token: string): Promise<boolean> {
  return (
    (await verifyJWT({
      token,
      publicKey: jwtConfig.publicKey,
      expectedIssuer: jwtConfig.issuer,
      expectedAudience: jwtConfig.audience,
    })) !== false
  );
}

export function isTokenExpired(payload: string | JWTPayload): boolean {
  return isExpired(payload);
}

export async function generateVerificationToken(
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

export async function verifyVerificationToken(
  token: string,
  expectedType: string
) {
  try {
    const payload = await verifyJWT<AccessTokenPayload>({
      token,
      publicKey: jwtConfig.publicKey,
      expectedIssuer: jwtConfig.issuer,
      expectedAudience: jwtConfig.audience,
    });

    logger.debug('Verified access token payload');

    if (payload.type !== expectedType) {
      logger.warn('Access token type mismatch or invalid payload');
      throw new UnauthorizedError({
        message: 'Invalid token type',
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    return payload;
  } catch (error) {
    logger.error('Error verifying access token:', error);
    throw error;
  }
}
