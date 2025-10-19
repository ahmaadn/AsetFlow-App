import { NextFunction, Request, Response } from 'express';

import * as folderService from '../services/folder.service';
import { QueryParams } from '../types/globals';

/**
 * Mengambil semua folder.
 */
export const getAllFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const queryParams = req.query as QueryParams;

    const result = await folderService.getAllFolders(user, queryParams);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
