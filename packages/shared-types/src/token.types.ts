import { SimpleUserType } from './user.types';

// Response Types
// -------------------------

export interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  user: SimpleUserType;
}

export interface PayloadTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenType: 'Bearer';
}
