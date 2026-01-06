// Response Types
// -------------------------

export interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface PayloadTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenType: 'Bearer';
}

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
