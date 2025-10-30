import { AssetModel, prisma } from '@asetflow/database';
import { AsetCreate } from '@asetflow/shared-types';

/**
 * Membuat aset baru
 * @param data Data aset baru
 * @returns Aset yang telah dibuat
 */
export const create = async (data: AsetCreate): Promise<AssetModel> => {
  return await prisma.asset.create({
    data: {
      folderId: data.folderId,
      ownerId: data.ownerId,
      publicId: data.publicId,
      originalName: data.originalName,
      slug: data.slug,
      size: data.size,
      mimeType: data.mimeType,
      assetType: data.assetType,
      url: data.url,
      format: data.format,
      resourceType: data.resourceType,
      width: data.width,
      height: data.height,
    },
  });
};

/**
 * Mencari aset berdasarkan ID
 * @param id ID aset
 * @returns Aset yang ditemukan atau null jika tidak ada
 */
export const findById = async (id: string): Promise<AssetModel | null> => {
  return await prisma.asset.findUnique({
    where: { id },
  });
};

/**
 * Mencari aset berdasarkan slug
 * @param slug Slug aset
 * @returns Aset yang ditemukan atau null jika tidak ada
 */
export const findBySlug = async (slug: string): Promise<AssetModel | null> => {
  return await prisma.asset.findFirst({
    where: { slug },
  });
};
