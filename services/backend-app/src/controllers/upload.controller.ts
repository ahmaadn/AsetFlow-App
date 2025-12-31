import type { NextFunction, Request, Response } from 'express';

import logger from '../configs/logger.config.js';
import assetRepository from '../repositories/asset.repository.js';
import folderRepository from '../repositories/folder.repository.js';
import { UploadService } from '../services/upload.service.js';
import { UnauthorizedError } from '../utils/api-error.js';

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService(assetRepository, folderRepository);

    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  async handleFileUpload(req: Request, res: Response, next: NextFunction) {
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

      const result = await this.uploadService.uploadAsset(
        folderId as string,
        user.id,
        req.file,
        filename,
        slug
      );

      res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

export const uploadController = new UploadController();
export default uploadController;
