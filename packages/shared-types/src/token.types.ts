import { UserInfoResponses } from './user.types';

// Response Types
// -------------------------

export interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  user: UserInfoResponses;
}

export interface PayloadTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenType: 'Bearer';
}
