import { prisma } from '@asetflow/database';

/**
 * Count total assets for a user
 */
export const countUserAssets = async (userId: string): Promise<number> => {
  return await prisma.asset.count({
    where: { ownerId: userId },
  });
};

/**
 * Count total folders for a user
 */
export const countUserFolders = async (userId: string): Promise<number> => {
  return await prisma.folder.count({
    where: { ownerId: userId },
  });
};

/**
 * Count total users in the system
 */
export const countTotalUsers = async (): Promise<number> => {
  return await prisma.user.count();
};

/**
 * Calculate total storage used by a user
 */
export const calculateUserStorage = async (userId: string): Promise<bigint> => {
  const result = await prisma.asset.aggregate({
    where: { ownerId: userId },
    _sum: {
      size: true,
    },
  });

  return result._sum.size || BigInt(0);
};

/**
 * Get recent files for a user
 */
export const findRecentFiles = async (userId: string, limit: number = 5) => {
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
};

/**
 * Get asset count grouped by mime type for a user
 */
export const findUserAssetMimeTypes = async (userId: string) => {
  return await prisma.asset.groupBy({
    by: ['mimeType'],
    where: { ownerId: userId },
    _count: {
      mimeType: true,
    },
  });
};

/**
 * Get assets created within a date range for a user
 */
export const findAssetsInDateRange = async (
  userId: string,
  startDate: Date
) => {
  return await prisma.asset.findMany({
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
};

/**
 * Calculate total views across all assets for a user
 */
export const calculateTotalViews = async (userId: string): Promise<number> => {
  const result = await prisma.asset.aggregate({
    where: { ownerId: userId },
    _sum: {
      viewCount: true,
    },
  });

  return result._sum.viewCount || 0;
};
