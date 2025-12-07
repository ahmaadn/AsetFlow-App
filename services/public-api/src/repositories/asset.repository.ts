import { type AssetModel, prisma } from '@asetflow/database';

/**
 * Mencari asset berdasarkan folder ID dan slug
 */
export const findByFolderAndSlug = async (
  folderId: string,
  slug: string
): Promise<AssetModel | null> => {
  return await prisma.asset.findFirst({
    where: {
      folderId,
      slug,
    },
  });
};

/**
 * Mengambil semua asset dalam folder
 */
export const findByFolder = async (
  folderId: string,
  assetType?: string
): Promise<AssetModel[]> => {
  return await prisma.asset.findMany({
    where: {
      folderId,
      ...(assetType ? { assetType } : {}),
    },
  });
};

/**
 * Increment view count untuk asset
 */
export const incrementViewCount = async (assetId: string): Promise<void> => {
  await prisma.asset.update({
    where: { id: assetId },
    data: {
      viewCount: { increment: 1 },
    },
  });
};
