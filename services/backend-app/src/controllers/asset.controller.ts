import { GetAssetsByTypeType, GetAssetsType } from '@asetflow/validators';
import { NextFunction, Request, Response } from 'express';

import * as asetService from '../services/asset.service.js';
import { UnauthorizedError } from '../utils/api-error.js';

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
    const queryParams = req.query as Partial<GetAssetsType>;

    const result = await asetService.getAssetsByFolder(
      folderId as string,
      queryParams
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update asset
 */
export const updateAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    const { id: assetId } = req.params;
    const updateData = req.body;

    const result = await asetService.updateAsset(assetId as string, updateData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Menghapus asset berdasarkan ID
 */
export const deleteAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    const { id: assetId } = req.params;

    await asetService.deleteAsset(assetId as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil info asset berdasarkan ID
 */
export const getAssetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    const { id: assetId } = req.params;

    const result = await asetService.getAssetById(assetId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAssetsByType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    const queryParams = req.query as Partial<GetAssetsByTypeType>;

    const result = await asetService.getAssetsByType(queryParams);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
