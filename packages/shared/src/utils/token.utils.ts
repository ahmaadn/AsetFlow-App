import * as jose from 'jose';

interface TokenDetails {
  publicKey: string;
  token: string;
  expectedIssuer?: string;
  expectedAudience?: string;
  alg?: string; // Optional algorithm, default is 'RS256'
}

interface JwtTokenPayload<T extends jose.JWTPayload = jose.JWTPayload> {
  payload: T;
  privateKey: string;
  exp?: string | number | Date;
  alg?: string; // Optional algorithm, default is 'RS256'

  iss?: string; // Optional issuer
  aud?: string; // Optional audience
}

export const ALGORITM = 'RS256';
export const DEFAULT_ISS = 'jwt-issuer';
export const DEFAULT_AUD = 'jwt-audience';

/**
 * Sign JWT token
 * @returns Signed JWT token
 */
export async function signJWT<T extends jose.JWTPayload>({
  payload,
  privateKey,
  exp = '2h',
  alg = ALGORITM,
  iss = DEFAULT_ISS,
  aud = DEFAULT_AUD,
}: JwtTokenPayload<T>): Promise<string> {
  const key = await jose.importPKCS8(privateKey, alg);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: alg })
    .setIssuedAt()
    .setExpirationTime(exp)
    .setIssuer(iss)
    .setAudience(aud)
    .sign(key);
}
/**
 * Decode JWT token without verifying
 * @param token JWT Token
 * @returns Decoded payload
 */
export function decodeJWT<T>(token: string): T {
  const { payload } = jose.decodeJwt(token);
  return payload as T;
}

/**
 * Check if JWT token is valid (check payload and expiration)
 * @param token JWT Token
 * @returns True if valid, otherwise false
 */
export async function isValidJWT(token: string): Promise<boolean> {
  try {
    const payload = jose.decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp || 0;
    return exp > now;
  } catch {
    return false;
  }
}

/**
 * Verify JWT token
 * @returns Payload if valid, otherwise false
 */
export async function verifyJWT<T>({
  publicKey,
  token,
  expectedIssuer,
  expectedAudience,
  alg = ALGORITM,
}: TokenDetails): Promise<T | false> {
  // Check signature and standard claims
  const key = await jose.importSPKI(publicKey, alg);
  const { payload } = await jose.jwtVerify(token, key, {
    issuer: expectedIssuer,
    audience: expectedAudience,
  });

  // Check expiration
  const { exp } = payload;
  if (!exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp > now ? (payload as T) : false;
}
