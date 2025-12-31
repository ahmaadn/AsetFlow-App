import { GetAssetsByTypeType, GetAssetsType } from '@asetflow/validators';
import { NextFunction, Request, Response } from 'express';

import assetRepository from '../repositories/asset.repository.js';
import { AssetService } from '../services/asset.service.js';
import { UnauthorizedError } from '../utils/api-error.js';

export class AssetController {
  private assetService: AssetService;
  constructor() {
    this.assetService = new AssetService(assetRepository); // Inisialisasi AssetService

    this.deleteAsset = this.deleteAsset.bind(this);
    this.getAssetsByFolder = this.getAssetsByFolder.bind(this);
    this.updateAsset = this.updateAsset.bind(this);
    this.getAssetById = this.getAssetById.bind(this);
    this.getAssetsByType = this.getAssetsByType.bind(this);
  }

  /**
   * Mengambil daftar asset berdasarkan folder
   */
  async getAssetsByFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }

      const { id: folderId } = req.params;
      const queryParams = req.query as Partial<GetAssetsType>;

      const result = await this.assetService.getAssetsByFolder(
        folderId as string,
        queryParams
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update asset
   */
  async updateAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }

      const { id: assetId } = req.params;
      const updateData = req.body;

      const result = await this.assetService.updateAsset(
        assetId as string,
        updateData
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menghapus asset berdasarkan ID
   */
  async deleteAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }

      const { id: assetId } = req.params;

      await this.assetService.deleteAsset(assetId as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mengambil info asset berdasarkan ID
   */
  async getAssetById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }

      const { id: assetId } = req.params;

      const result = await this.assetService.getAssetById(assetId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAssetsByType(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }

      const queryParams = req.query as Partial<GetAssetsByTypeType>;

      const result = await this.assetService.getAssetsByType(queryParams);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const assetController = new AssetController();
export default assetController;
