import { Prisma } from '@asetflow/database';
import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../utils/api-error.js';
import { ErrorCode } from '../utils/error-code.js';
import logger from '../utils/logger.js';

/**
 * Middleware untuk menangani error secara global.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Catat pesan error menggunakan logger package
  logger.error(err.message, {
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Tangani error yang sudah berupa ApiError
  if (err instanceof ApiError) {
    logger.error('Handling ApiError', {
      statusCode: err.statusCode,
      details: err.toJSON(),
    });
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
    logger.warn('Unhandled Prisma Error', {
      code: err.code,
      meta: err.meta,
    });
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

  // Fallback untuk kasus yang tidak terduga
  return next();
};
