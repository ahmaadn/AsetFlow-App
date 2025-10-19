import { UserModel } from '@asetflow/database';
import type {
  PaginationResult,
  FolderDetailResponse,
} from '@asetflow/shared-types';

import * as FolderRepository from '../repositories/folder.repository';
import { QueryParams } from '../types/globals';

/**
 * Mendapatkan semua folder milik user
 * @param user Pemilik folder
 * @param param1 Opsi untuk mendapatkan folder
 * @returns Daftar folder
 */
export const getAllFolders = async (
  user: UserModel,
  {
    page = 1,
    per_page = 20,
    search = '',
    sort_by = 'createdAt',
    order = 'desc',
  }: QueryParams
): Promise<PaginationResult<FolderDetailResponse>> => {
  // Mengambil folder dari repository
  const folders = await FolderRepository.getByFilter({
    where: {
      ownerId: user.id,
      ...(search && { name: { $like: `%${search}%` } }),
    },
    limit: per_page,
    offset: (page - 1) * per_page,
    sort_by,
    order,
  });

  // Mapping ke response type
  return {
    items: folders.map((folder) => ({
      id: folder.id,
      ownerId: folder.ownerId,
      name: folder.name,
      slug: folder.slug,
      createdAt: folder.createdAt.toISOString(),
      updatedAt: folder.updatedAt.toISOString(),
      assetCount: folder._count.assets,
      tags: [],
    })),
    total: folders.length,
    page,
    per_page,
  };
};
