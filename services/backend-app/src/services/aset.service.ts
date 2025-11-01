import {
  AsetCreate,
  AsetResponse,
  PaginationResult,
} from '@asetflow/shared-types';

import * as AssetRepository from '../repositories/aset.repository';
import logger from '../utils/logger';

/**
 * Membuat aset baru.
 * @param data Data aset yang akan dibuat.
 * @returns Aset yang telah dibuat.
 */
export const createAset = async (data: AsetCreate) => {
  return await AssetRepository.create(data);
};

/**
 * Mengambil daftar asset berdasarkan folder dengan pagination
 * @param folderId ID folder
 * @param queryParams Parameter query untuk pagination dan filter
 * @returns Daftar asset dengan pagination
 */
export const getAssetsByFolder = async (
  folderId: string,
  queryParams: {
    page?: number;
    per_page?: number;
    assetType?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }
): Promise<PaginationResult<AsetResponse>> => {
  const {
    page = 1,
    per_page = 20,
    assetType,
    sort_by = 'createdAt',
    order = 'desc',
  } = queryParams;

  const assets = await AssetRepository.getByFolderWithPagination({
    folderId,
    limit: per_page,
    offset: (page - 1) * per_page,
    assetType,
    sort_by,
    order,
  });

  logger.info(`Fetched '${assets.length}' assets from folder '${folderId}'`);

  const total = await AssetRepository.countByFolder(folderId, assetType);

  return {
    items: assets.map((asset) => ({
      ...asset,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })),
    total,
    page,
    per_page,
  };
};
