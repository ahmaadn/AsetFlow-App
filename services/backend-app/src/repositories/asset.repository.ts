import { AssetModel, prisma } from '@asetflow/database';
import { AssetCreate } from '@asetflow/shared-types';

/**
 * Membuat aset baru
 * @param data Data aset baru
 * @returns Asset yang telah dibuat
 */
export const create = async (data: AssetCreate): Promise<AssetModel> => {
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
 * @returns Asset yang ditemukan atau null jika tidak ada
 */
export const findById = async (id: string): Promise<AssetModel | null> => {
  return await prisma.asset.findUnique({
    where: { id },
  });
};

/**
 * Mencari aset berdasarkan slug
 * @param slug Slug aset
 * @returns Asset yang ditemukan atau null jika tidak ada
 */
export const findBySlug = async (slug: string): Promise<AssetModel | null> => {
  return await prisma.asset.findFirst({
    where: { slug },
  });
};

/**
 * Memeriksa apakah slug aset sudah ada di dalam folder tertentu
 * @param folderId  ID folder
 * @param slugAset Slug aset
 * @returns True jika slug sudah ada, false jika tidak
 */
export const checkSlugExists = async (
  folderId: string,
  slugAset: string
): Promise<boolean> => {
  const count = await prisma.asset.count({
    where: {
      folderId,
      slug: slugAset,
    },
  });
  return count > 0;
};

/**
 * Mengambil asset berdasarkan folder dengan pagination dan filter
 * @param options Opsi filter dan pagination
 * @returns Daftar asset yang sesuai filter
 */
export const getByFolderWithPagination = async (options: {
  folderId: string;
  limit: number;
  offset: number;
  assetType?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}) => {
  const { folderId, limit, offset, assetType, sort_by, order } = options;

  return await prisma.asset.findMany({
    where: {
      folderId,
      ...(assetType ? { assetType } : {}),
    },
    take: limit,
    skip: offset,
    orderBy: {
      [sort_by || 'createdAt']: order || 'desc',
    },
  });
};

/**
 * Menghitung total asset berdasarkan folder
 * @param folderId ID folder
 * @param assetType Tipe asset (optional)
 * @returns Total jumlah asset
 */
export const countByFolder = async (
  folderId: string,
  assetType?: string
): Promise<number> => {
  return await prisma.asset.count({
    where: {
      folderId,
      ...(assetType ? { assetType } : {}),
    },
  });
};
