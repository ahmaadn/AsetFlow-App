import { env } from './env.config.js';

export const jwtConfig = {
  accessTokenExpiration: env.JWT_ACCESS_TOKEN_EXPIRATION,
  refreshTokenExpiration: env.JWT_REFRESH_TOKEN_EXPIRATION,
  privateKey: env.JWT_PRIVATE_KEY,
  publicKey: env.JWT_PUBLIC_KEY,
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
} as const;
