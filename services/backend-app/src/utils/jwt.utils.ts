import { verifyJWT, signJWT, decodeJWT, isExpired } from '@asetflow/shared';
import type { AccessTokenPayload, RefreshTokenPayload } from '@asetflow/shared';
import type { JWTPayload } from 'jose';

import { jwtConfig } from '../configs/jwt.config.js';
import logger from '../configs/logger.config.js';

export type AccessTokenCredentials = {
  name: string;
  userId: string;
  email: string;
  role: string;
};

export type RefreshTokenCredentials = {
  userId: string;
  tokenId: string;
};

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
): Promise<AccessTokenPayload<T> | false> {
  try {
    const payload = await verifyJWT<AccessTokenPayload<T>>({
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
 * Verify refresh token with custom payload type (Generic)
 * @example
 * const payload = await verifyRefreshToken<{ userId: string; tokenId: string; deviceId: string }>(token)
 */
export async function verifyRefreshToken<
  T extends { userId: string; tokenId: string } = {
    userId: string;
    tokenId: string;
  },
>(token: string): Promise<RefreshTokenPayload<T> | false> {
  try {
    const payload = await verifyJWT<RefreshTokenPayload<T>>({
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
