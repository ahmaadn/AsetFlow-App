import { prisma } from '@asetflow/database';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../utils/api-error';

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
      sub: string;
    };

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.sub },
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
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    // Tangani error verifikasi JWT (misal: token expired, tidak valid)
    next(new UnauthorizedError({ message: 'Invalid or expired token.' }));
  }
};
