import {
  AssetCreate,
  AssetResponse,
  MetadataAsset,
  PaginationResult,
} from '@asetflow/shared-types';
import {
  GetAssetsByTypeType,
  GetAssetsType,
  UpdateAssetType,
} from '@asetflow/validators';

import logger from '../configs/logger.config.js';
import * as AssetRepository from '../repositories/asset.repository.js';
import { ConflictError, NotFoundError } from '../utils/api-error.js';

/**
 * Membuat aset baru.
 * @param data Data aset yang akan dibuat.
 * @returns Asset yang telah dibuat.
 */
export const createAset = async (data: AssetCreate) => {
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
  queryParams: Partial<GetAssetsType>
): Promise<PaginationResult<AssetResponse>> => {
  const {
    page = 1,
    per_page = 20,
    assetType = 'all',
    sort_by = 'createdAt',
    order = 'desc',
  } = queryParams;

  logger.info(
    `Fetching assets from folder '${folderId}' with params: page=${page}, per_page=${per_page}, assetType=${assetType}, sort_by=${sort_by}, order=${order}`
  );

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
      id: asset.id,
      folderId: asset.folderId,
      ownerId: asset.ownerId,
      publicId: asset.publicId,
      name: asset.name,
      slug: asset.slug,
      size: Number(asset.size),
      mimeType: asset.mimeType,
      url: asset.url,
      format: asset.format,
      viewCount: asset.viewCount,
      metadata: asset.metadata as unknown as MetadataAsset,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })),
    total,
    page,
    per_page,
  };
};

/**
 * Mengambil daftar asset berdasarkan folder dengan pagination
 * @param folderId ID folder
 * @param queryParams Parameter query untuk pagination dan filter
 * @returns Daftar asset dengan pagination
 */
export const getAssetsByType = async (
  queryParams: Partial<GetAssetsByTypeType>
): Promise<PaginationResult<AssetResponse>> => {
  const {
    page = 1,
    per_page = 20,
    assetType = 'all',
    sort_by = 'createdAt',
    order = 'desc',
  } = queryParams;

  const assets = await AssetRepository.getByTypeWithPagination({
    limit: per_page,
    offset: (page - 1) * per_page,
    assetType,
    sort_by,
    order,
  });

  logger.info(`Fetched '${assets.length}' assets of type '${assetType}'`);

  const total = await AssetRepository.countByType(assetType);

  return {
    items: assets.map((asset) => ({
      id: asset.id,
      folderId: asset.folderId,
      ownerId: asset.ownerId,
      publicId: asset.publicId,
      name: asset.name,
      slug: asset.slug,
      size: Number(asset.size),
      mimeType: asset.mimeType,
      url: asset.url,
      format: asset.format,
      metadata: asset.metadata as unknown as MetadataAsset,
      viewCount: asset.viewCount,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    })),
    total,
    page,
    per_page,
  };
};

/**
 * Update asset
 * @param assetId ID asset
 * @param data Data yang akan diupdate
 * @returns Asset yang telah diupdate
 */
export const updateAsset = async (
  assetId: string,
  data: UpdateAssetType
): Promise<AssetResponse> => {
  const existingAsset = await AssetRepository.findById(assetId);
  if (!existingAsset) {
    throw new NotFoundError({ message: 'Asset not found' });
  }

  // Jika slug diubah, pastikan slug baru tidak duplikat di folder yang sama
  if (data.slug && data.slug !== existingAsset.slug) {
    const slugExists = await AssetRepository.checkSlugExists(
      existingAsset.folderId,
      data.slug
    );
    if (slugExists) {
      throw new ConflictError({ message: 'Slug already exists in the folder' });
    }
  }
  logger.info(`Updating asset with ID '${assetId}'`);

  const updatedAsset = await AssetRepository.update(assetId, data);
  return {
    id: updatedAsset.id,
    folderId: updatedAsset.folderId,
    ownerId: updatedAsset.ownerId,
    publicId: updatedAsset.publicId,
    name: updatedAsset.name,
    slug: updatedAsset.slug,
    size: Number(updatedAsset.size),
    mimeType: updatedAsset.mimeType,
    url: updatedAsset.url,
    format: updatedAsset.format,
    metadata: updatedAsset.metadata as unknown as MetadataAsset,
    viewCount: updatedAsset.viewCount,
    createdAt: updatedAsset.createdAt.toISOString(),
    updatedAt: updatedAsset.updatedAt.toISOString(),
  };
};

/**
 * Mengambil asset berdasarkan ID
 * @param assetId ID asset
 * @returns Asset yang ditemukan
 */
export const getAssetById = async (assetId: string): Promise<AssetResponse> => {
  const asset = await AssetRepository.findById(assetId);
  if (!asset) {
    throw new NotFoundError({ message: 'Asset not found' });
  }

  return {
    id: asset.id,
    folderId: asset.folderId,
    ownerId: asset.ownerId,
    publicId: asset.publicId,
    name: asset.name,
    slug: asset.slug,
    size: Number(asset.size),
    mimeType: asset.mimeType,
    url: asset.url,
    format: asset.format,
    metadata: asset.metadata as unknown as MetadataAsset,
    viewCount: asset.viewCount,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
};

export const deleteAsset = async (assetId: string): Promise<void> => {
  const asset = await AssetRepository.findById(assetId);
  if (!asset) {
    throw new NotFoundError({ message: 'Asset not found' });
  }

  await AssetRepository.deleteById(assetId);
  logger.info(`Deleted asset with ID '${assetId}'`);
};
