import type { UserModel } from '@asetflow/database';
import { fromNodeHeaders } from 'better-auth/node';
import { Request, Response, NextFunction } from 'express';

import { env } from '../configs/env.config.js';
import { logger } from '../configs/logger.config.js';
import { UnauthorizedError } from '../utils/api-error.js';
import { auth } from '../utils/auth.js';

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
        env.CORS_ORIGIN || 'http://localhost:3000'
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
    logger.debug('Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      headers: Object.keys(req.headers),
      cookies: req.headers.cookie ? 'present' : 'missing',
    });

    if (!session || !session.user) {
      return next(
        new UnauthorizedError({ message: 'Authentication required.' })
      );
    }

    req.user = session.user as UserModel;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('Better Auth protection error:', error);
    next(error);
  }
};
