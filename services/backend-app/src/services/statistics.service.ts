import { formatSize } from '@asetflow/shared';
import type { DashboardStatistics, RecentFile } from '@asetflow/shared-types';

import logger from '../configs/logger.config.js';
import type { IStatisticsRepository } from '../repositories/statistics.repository.js';
import {
  calculateAssetTypeDistribution,
  calculateRecentUploadActivity,
  getStartDate,
} from '../utils/statistics.helper.js';

export class StatisticsService {
  private statisticsRepository: IStatisticsRepository;
  constructor(statisticsRepository: IStatisticsRepository) {
    this.statisticsRepository = statisticsRepository;
  }

  /**
   * Get all dashboard statistics in one call
   */
  async getUserDashboardStatistics(
    userId: string
  ): Promise<DashboardStatistics> {
    logger.info(`Fetching dashboard statistics for user: ${userId}`);
    const timeStart = Date.now();
    const [
      totalAssets,
      totalFolders,
      totalUsers,
      storageBytes,
      totalViews,
      rawRecentFiles,
      countByMimeType,
      recentAssets,
    ] = await Promise.all([
      this.statisticsRepository.countUserAssets(userId),
      this.statisticsRepository.countUserFolders(userId),
      this.statisticsRepository.countTotalUsers(),
      this.statisticsRepository.calculateUserStorage(userId),
      this.statisticsRepository.calculateTotalViews(userId),
      this.statisticsRepository.findRecentFiles(userId, 5),
      this.statisticsRepository.countAssetsByMimeType(userId),
      this.statisticsRepository.findAssetsInDateRange(userId, getStartDate(7)),
    ]);
    const timeEnd = Date.now();
    logger.info(
      `Fetched dashboard statistics for user: ${userId} in ${
        timeEnd - timeStart
      } ms`
    );

    // Format storage
    const totalStorage = formatSize(Number(storageBytes));

    // Calculate asset type distribution
    const assetTypeDistribution =
      calculateAssetTypeDistribution(countByMimeType);

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
  }
}
