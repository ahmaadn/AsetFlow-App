import { logger } from '@asetflow/logger';

import * as AssetRepository from '../repositories/asset.repository.js';
import * as FolderRepository from '../repositories/folder.repository.js';

/**
 * Get asset by folder slug and asset slug
 */
export const getAssetBySlug = async (folderSlug: string, assetSlug: string) => {
  // Find folder
  const folder = await FolderRepository.findBySlug(folderSlug);
  if (!folder) {
    logger.warn(`Folder not found: ${folderSlug}`);
    return null;
  }

  // Find asset
  const asset = await AssetRepository.findByFolderAndSlug(folder.id, assetSlug);
  if (!asset) {
    logger.warn(`Asset not found: ${assetSlug} in folder: ${folderSlug}`);
    return null;
  }

  // Increment view count
  await AssetRepository.incrementViewCount(asset.id);
  logger.info(`Asset viewed: ${asset.slug}, views: ${asset.viewCount + 1}`);

  return asset;
};

/**
 * Get all assets in folder
 */
export const getAssetsByFolder = async (
  folderSlug: string,
  assetType?: string
) => {
  // Find folder
  const folder = await FolderRepository.findBySlug(folderSlug);
  if (!folder) {
    logger.warn(`Folder not found: ${folderSlug}`);
    return null;
  }

  // Get assets
  const assets = await AssetRepository.findByFolder(folder.id, assetType);
  logger.info(`Fetched ${assets.length} assets from folder: ${folderSlug}`);

  return { folder, assets };
};
