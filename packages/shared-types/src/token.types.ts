import { SimpleUser } from './user.types';

export interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  user: SimpleUser;
}

export interface PayloadTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenType: 'Bearer';
}
