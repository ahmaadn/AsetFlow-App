import { NextFunction, Request, Response } from 'express';

import * as asetService from '../services/asset.service';
import { QueryParams } from '../types/globals';
import { UnauthorizedError } from '../utils/api-error';

/**
 * Mengambil daftar asset berdasarkan folder
 */
export const getAssetsByFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    const { id: folderId } = req.params;
    const queryParams = req.query as QueryParams;

    const result = await asetService.getAssetsByFolder(folderId, queryParams);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
