import type { JWTPayload } from 'jose';

// Base token types with required fields only
export interface BaseAccessTokenPayload extends JWTPayload {
  type: 'access';
}

export interface BaseRefreshTokenPayload extends JWTPayload {
  type: 'refresh';
  tokenId: string;
  userId: string;
}

// Generic types for extension
export type AccessTokenPayload<
  T extends Record<string, unknown> = Record<string, unknown>,
> = BaseAccessTokenPayload & T;

export type RefreshTokenPayload<
  T extends Record<string, unknown> = Record<string, unknown>,
> = BaseRefreshTokenPayload & T;
