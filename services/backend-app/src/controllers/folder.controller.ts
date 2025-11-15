import { GetFolderType } from '@asetflow/validators';
import { NextFunction, Request, Response } from 'express';

import * as folderService from '../services/folder.service';
import { UnauthorizedError } from '../utils/api-error';

/**
 * Mengambil semua folder.
 */
export const getAllFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }
    const queryParams = req.query as Partial<GetFolderType>;
    const result = await folderService.getAllFolders(user, queryParams);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Membuat sebuah folder baru
 */
export const createFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }
    const result = await folderService.createFolder(user, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Untuk memperbarui folder yang ada
 */
export const updateFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }
    const folderId = req.params.id;
    const result = await folderService.updateFolder(folderId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Untuk memperbarui folder yang ada
 */
export const deleteFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }
    const folderId = req.params.id;
    await folderService.deleteFolder(folderId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Memeriksa apakah folder dengan ID tertentu ada
 */
export const checkFolderExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }
    const folderId = req.params.id;
    const exists = await folderService.checkFolder(folderId);
    if (exists) {
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};
