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

/**
 * Membuat sebuah folder baru
 * @param req
 * @param res
 * @param next
 */
export const createFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const result = await folderService.createFolder(user, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
