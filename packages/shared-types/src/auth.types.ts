export type TokenPayload = {
  sub: string; // User ID
  email: string;
};

export type AuthTokens = {
  accessToken: string;
  tokenType: 'Bearer';
};
