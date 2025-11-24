import { formatSize } from '@asetflow/shared';
import { DashboardStatistics, RecentFile } from '@asetflow/shared-types';

import * as statisticsRepository from '../repositories/statistics.repository';
import {
  calculateAssetTypeDistribution,
  calculateRecentUploadActivity,
  getStartDate,
} from '../utils/statistics.helper';

/**
 * Get all dashboard statistics in one call
 */
export const getDashboardStatistics = async (
  userId: number
): Promise<DashboardStatistics> => {
  const [
    totalAssets,
    totalFolders,
    totalUsers,
    storageBytes,
    totalViews,
    rawRecentFiles,
    assetMimeTypes,
    recentAssets,
  ] = await Promise.all([
    statisticsRepository.countUserAssets(userId),
    statisticsRepository.countUserFolders(userId),
    statisticsRepository.countTotalUsers(),
    statisticsRepository.calculateUserStorage(userId),
    statisticsRepository.calculateTotalViews(userId),
    statisticsRepository.findRecentFiles(userId, 5),
    statisticsRepository.findUserAssetMimeTypes(userId),
    statisticsRepository.findAssetsInDateRange(userId, getStartDate(7)),
  ]);

  // Format storage
  const totalStorage = formatSize(Number(storageBytes));

  // Calculate asset type distribution
  const assetTypeDistribution = calculateAssetTypeDistribution(assetMimeTypes);

  // Calculate recent upload activity
  const recentUploadActivity = calculateRecentUploadActivity(recentAssets, 7);

  const recentFiles: RecentFile[] = rawRecentFiles.map((file) => ({
    id: file.id,
    name: file.name,
    slug: file.slug,
    size: Number(file.size),
    mimeType: file.mimeType,
    url: file.url,
    format: file.format,
    viewCount: file.viewCount,
    createdAt: file.createdAt,
    folder: {
      name: file.folder.name,
      slug: file.folder.slug,
    },
  }));

  return {
    totalAssets,
    totalFolders,
    totalUsers,
    totalStorage,
    storageBytes: Number(storageBytes),
    totalViews,
    recentFiles,
    assetTypeDistribution,
    recentUploadActivity,
  };
};
