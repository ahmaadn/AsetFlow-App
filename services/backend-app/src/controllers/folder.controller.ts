import { GetFolderType } from '@asetflow/validators';
import { NextFunction, Request, Response } from 'express';

import folderRepository from '../repositories/folder.repository.js';
import { FolderService } from '../services/folder.service.js';
import { UnauthorizedError } from '../utils/api-error.js';

export class FolderController {
  private folderService: FolderService;
  constructor() {
    this.folderService = new FolderService(folderRepository);

    this.getAllFolder = this.getAllFolder.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.updateFolder = this.updateFolder.bind(this);
    this.deleteFolder = this.deleteFolder.bind(this);
    this.checkFolderExists = this.checkFolderExists.bind(this);
  }

  /**
   * Mengambil semua folder.
   */
  async getAllFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }
      const queryParams = req.query as Partial<GetFolderType>;
      const result = await this.folderService.getAllFolders(
        user.id,
        queryParams
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Membuat sebuah folder baru
   */
  async createFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }
      const result = await this.folderService.createFolder(user.id, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Untuk memperbarui folder yang ada
   */
  async updateFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }
      const folderId = req.params.id as string;
      const result = await this.folderService.updateFolder(folderId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Untuk memperbarui folder yang ada
   */
  async deleteFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }
      const folderId = req.params.id as string;
      await this.folderService.deleteFolder(folderId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Memeriksa apakah folder dengan ID tertentu ada
   */
  async checkFolderExists(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }
      const folderId = req.params.id as string;
      const exists = await this.folderService.checkFolder(folderId);
      if (exists) {
        res.status(200).send();
      } else {
        res.status(404).send();
      }
    } catch (error) {
      next(error);
    }
  }
}

export const folderController = new FolderController();
export default folderController;
