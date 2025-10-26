import { FolderModel, prisma } from '@asetflow/database';
import { UpdateFolderType } from '@asetflow/validators';

/**
 * Mengambil semua folder.
 * @returns Daftar semua folder
 */
export const getAll = async (): Promise<FolderModel[]> => {
  return await prisma.folder.findMany();
};

/**
 * Mengambil folder berdasarkan filter.
 * @param options Opsi filter
 * @returns Folder yang sesuai filter
 */
export const getByFilter = async (options: {
  where: { ownerId: number; name?: { $like: string } };
  limit: number;
  offset: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}) => {
  const { where, limit, offset, sort_by, order } = options;

  return await prisma.folder.findMany({
    where: {
      ownerId: where.ownerId,
      ...(where.name ? { name: { contains: where.name.$like } } : {}),
    },
    take: limit || 1,
    skip: offset,
    orderBy: {
      [sort_by || 'createdAt']: order || 'asc',
    },
    include: {
      _count: {
        select: { assets: true },
      },
    },
  });
};

/**
 * Membuat folder baru.
 * @param data Data folder baru
 * @returns Folder yang dibuat
 */
export const create = async (data: {
  name: string;
  ownerId: number;
  slug: string;
}): Promise<FolderModel> => {
  return await prisma.folder.create({
    data,
  });
};

/**
 * Menghapus folder berdasarkan ID.
 * @param folderId ID folder yang akan dihapus
 */
export const deleteFolder = async (folderId: string): Promise<void> => {
  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
};

/**
 * Mengupdate folder berdasarkan ID.
 * @param folderId ID folder yang akan diupdate
 * @param data Data folder yang akan diupdate
 * @returns Folder yang telah diupdate
 */
export const update = async (folderId: string, data: UpdateFolderType) => {
  return await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      name: data.name,
      slug: data.slug,
    },
    include: {
      _count: {
        select: { assets: true },
      },
    },
  });
};

/**
 * Mencari folder berdasarkan slug.
 * @param slug  Slug folder
 * @returns Folder yang ditemukan atau null
 */
export const findSlug = async (slug: string): Promise<FolderModel | null> => {
  return await prisma.folder.findUnique({
    where: {
      slug,
    },
  });
};

/**
 * Mencari folder berdasarkan ID.
 * @param id ID folder
 * @returns Folder yang ditemukan atau null
 */
export const findById = async (id: string): Promise<FolderModel | null> => {
  return await prisma.folder.findUnique({
    where: {
      id,
    },
  });
};
