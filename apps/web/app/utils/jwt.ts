import { jwtDecode, type JwtPayload } from 'jwt-decode';

export interface PayloadWithEmail extends JwtPayload {
  email?: string;
}

/**
 * Mendekode token JWT.
 * @param token  JWT string
 * @returns Payload token atau null jika gagal decode.
 */
export function decodeToken(token: string) {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Memeriksa apakah payload sudah kedaluwarsa.
 * @param token JWT string
 * @returns boolean true jika valid, false jika kedaluwarsa atau tidak valid.
 */
export function isValidPayload(payload: PayloadWithEmail | null): boolean {
  if (!payload) return false;

  const expirationTimeInMs = (payload.exp || 0) * 1000;
  const isExpired = Date.now() >= expirationTimeInMs;

  if (isExpired) {
    console.warn('Auth token is expired.');
  }

  return !isExpired;
}

/**
 * Memeriksa apakah token valid.
 * @param token JWT string
 * @returns boolean true jika valid, false jika tidak valid.
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  const payload = decodeToken(token) as PayloadWithEmail | null;
  return isValidPayload(payload);
}
