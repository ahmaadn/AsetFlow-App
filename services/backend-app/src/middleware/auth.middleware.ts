import { prisma } from '@asetflow/database';
import { fromNodeHeaders } from 'better-auth/node';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../utils/api-error';
import { auth } from '../utils/auth';
/**
 * Middleware untuk melindungi route yang membutuhkan autentikasi.
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new UnauthorizedError({
          message: 'No token provided, authorization denied.',
        })
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      sub: string;
    };

    const currentUser = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!currentUser) {
      return next(
        new UnauthorizedError({
          message: 'The user belonging to this token does no longer exist.',
        })
      );
    }

    req.user = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const betterAuthProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add CORS headers for preflight requests
    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Origin',
        process.env.CORS_ORIGIN || 'http://localhost:3000'
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cookie'
      );
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      );
      return res.sendStatus(200);
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // Debug logging
    if (process.env.DEBUG === 'true') {
      console.log('Session check:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        headers: Object.keys(req.headers),
        cookies: req.headers.cookie ? 'present' : 'missing',
      });
    }

    if (!session || !session.user) {
      return next(
        new UnauthorizedError({ message: 'Authentication required.' })
      );
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('Better Auth protection error:', error);
    next(error);
  }
};
