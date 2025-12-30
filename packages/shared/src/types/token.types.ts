import type { JWTPayload } from 'jose';

export interface AccessTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access';
}

export interface RefreshTokenPayload extends JWTPayload {
  userId: string;
  tokenId: string;
  type: 'refresh';
}
