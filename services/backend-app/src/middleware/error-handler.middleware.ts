import { Prisma } from '@asetflow/database';
import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../utils/api-error';
import { ErrorCode } from '../utils/error-code';
import logger from '../utils/logger';

/**
 * Middleware untuk menangani error secara global.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Catat pesan error
  logger.error(err.message);
  logger.error(err.stack || '');

  // Tangani error yang sudah berupa ApiError
  if (err instanceof ApiError) {
    logger.error(`Handling ApiError with status code ${err.statusCode}`);
    logger.error(`ApiError details: ${JSON.stringify(err.toJSON())}`);
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle error dari Multer (cth: file terlalu besar)
  if (err.name === 'MulterError' && err.message === 'File too large') {
    return res.status(400).json({
      status: 'fail',
      message: 'File too large. Max size is 10MB.',
    });
  }

  // Pengaman untuk error Prisma yang tidak ditangani di service
  // Ini adalah error yang "tidak terduga" dari sisi bisnis
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Memberikan respons generik karena kita tidak mengharapkannya
    logger.warn(`Unhandled Prisma Error Code: ${err.code}`, { meta: err.meta });
    return res.status(400).json({
      message: 'A database error occurred.',
      errorCode: ErrorCode.API_ERROR,
    });
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    logger.error('An unknown database error occurred.', { error: err });
    return res.status(500).json({
      message: 'An unexpected database error occurred.',
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.error('Failed to initialize database connection.', { error: err });
    return res.status(500).json({
      message: 'Could not connect to the database.',
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    });
  }
  next();
};
