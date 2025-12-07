import type { NextFunction, Request, Response } from 'express';

import * as UploadService from '../services/upload.service';
import { UnauthorizedError } from '../utils/api-error';
import logger from '../utils/logger';

export const handleFileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filename, slug } = req.body;

    logger.debug('Received fields:', { filename, slug });
    logger.debug('Received file:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Cek folder
    const { id: folderId } = req.params;

    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    const result = await UploadService.uploadAset(
      folderId as string,
      user,
      req.file,
      filename,
      slug
    );

    res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};
