import { FolderModel, prisma } from '@asetflow/database';

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
