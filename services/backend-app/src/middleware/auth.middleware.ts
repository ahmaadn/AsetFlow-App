import { ErrorCode } from '@asetflow/shared';
import type { NextFunction, Request, Response } from 'express';

import logger from '../configs/logger.config.js';
import { userRepository } from '../repositories/user.repository.js';
import { ForbiddenError, UnauthorizedError } from '../utils/api-error.js';
import * as JwtUtils from '../utils/jwt.utils.js';

/**
 * Extract token from Authorization header or cookies
 */
function extractToken(req: Request): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Middleware to authenticate JWT token
 */
export async function authenticateJWT(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new ForbiddenError({
        message: 'No access provided',
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    // verify token
    const payload = await JwtUtils.verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedError({
        message: 'Invalid token',
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    // cek expired token
    const isExpired = JwtUtils.isTokenExpired(payload);
    if (isExpired) {
      throw new UnauthorizedError({
        message: 'Token expired',
        errorCode: ErrorCode.TOKEN_EXPIRED,
      });
    }

    // cek user ada atau tidak di database
    const cuurentUser = await userRepository.findByEmail(payload.email);
    if (!cuurentUser) {
      throw new UnauthorizedError({
        message: 'User not found',
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }

    // Add user info to request
    req.user = {
      id: cuurentUser.id,
      name: cuurentUser.name,
      email: cuurentUser.email,
      role: cuurentUser.role,
    };
    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    throw new UnauthorizedError({
      message: 'Invalid or expired token.',
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(roles: string | string[]) {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    if (!requiredRoles.includes(req.user.role)) {
      throw new ForbiddenError({ message: 'Insufficient permissions' });
    }

    next();
  };
}

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole('ADMIN');

/**
 * Combined middleware: authenticate token + require role
 */
export function authenticateUserWithRoles(roles: string | string[]) {
  return [authenticateJWT, requireRole(roles)];
}
