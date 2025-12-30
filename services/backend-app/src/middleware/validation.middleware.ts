import { formatZodErrors } from '@asetflow/validators';
import type { Request, Response, NextFunction } from 'express';
import z, { ZodError } from 'zod';

import { BadRequestError } from '../utils/api-error.js';

/**
 * Validasi data request menggunakan schema Zod.
 * @param schema  Schema Zod untuk validasi.
 * @returns   Middleware Express untuk validasi.
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Jika validasi berhasil, lanjutkan ke controller berikutnya
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new BadRequestError({
          message: 'Validation Error',
          details: formatZodErrors(error),
        });
        return next(validationError);
      }

      // Jika error lain, teruskan
      return next(error);
    }
  };
};
