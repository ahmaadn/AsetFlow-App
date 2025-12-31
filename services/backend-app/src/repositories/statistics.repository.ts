import { AssetModel, prisma } from '@asetflow/database';

interface RecentAssetQuery extends AssetModel {
  folder: {
    name: string;
    slug: string;
  };
}

interface CountByMimeTypeQuery {
  mimeType: string;
  _count: {
    mimeType: number;
  };
}

interface DateRangeAssetQuery {
  createdAt: Date;
}

export interface IStatisticsRepository {
  /**
   * Count total assets for a user
   */
  countUserAssets(userId: string): Promise<number>;

  /**
   * Count total folders for a user
   */
  countUserFolders(userId: string): Promise<number>;

  /**
   * Count total users in the system
   */
  countTotalUsers(): Promise<number>;

  /**
   * Calculate total storage used by a user
   */
  calculateUserStorage(userId: string): Promise<bigint>;

  /**
   * Get recent files for a user
   */
  findRecentFiles(userId: string, limit?: number): Promise<RecentAssetQuery[]>;

  /**
   * Get asset count grouped by mime type for a user
   */
  countAssetsByMimeType(userId: string): Promise<CountByMimeTypeQuery[]>;

  /**
   * Get assets created within a date range for a user
   */
  findAssetsInDateRange(
    userId: string,
    startDate: Date
  ): Promise<DateRangeAssetQuery[]>;

  /**
   * Calculate total views across all assets for a user
   */
  calculateTotalViews(userId: string): Promise<number>;
}

class StatisticsRepository implements IStatisticsRepository {
  async countUserAssets(userId: string): Promise<number> {
    return await prisma.asset.count({
      where: { ownerId: userId },
    });
  }

  async countUserFolders(userId: string): Promise<number> {
    return await prisma.folder.count({
      where: { ownerId: userId },
    });
  }

  async countTotalUsers(): Promise<number> {
    return await prisma.user.count();
  }

  async calculateUserStorage(userId: string): Promise<bigint> {
    const result = await prisma.asset.aggregate({
      where: { ownerId: userId },
      _sum: {
        size: true,
      },
    });

    return result._sum.size || BigInt(0);
  }

  async findRecentFiles(
    userId: string,
    limit: number = 5
  ): Promise<RecentAssetQuery[]> {
    return await prisma.asset.findMany({
      where: { ownerId: userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        folder: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async countAssetsByMimeType(userId: string): Promise<CountByMimeTypeQuery[]> {
    const result = await prisma.asset.groupBy({
      by: ['mimeType'],
      where: { ownerId: userId },
      _count: {
        mimeType: true,
      },
    });
    return result;
  }

  async findAssetsInDateRange(
    userId: string,
    startDate: Date
  ): Promise<DateRangeAssetQuery[]> {
    const result = await prisma.asset.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return result;
  }

  async calculateTotalViews(userId: string): Promise<number> {
    const result = await prisma.asset.aggregate({
      where: { ownerId: userId },
      _sum: {
        viewCount: true,
      },
    });

    return result._sum.viewCount || 0;
  }
}

export const statisticsRepository = new StatisticsRepository();
export default statisticsRepository;
