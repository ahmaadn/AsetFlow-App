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
      ...folder,
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

/**
 * Membuat folder baru
 * @param user Pemilik folder
 * @param data Data folder yang akan dibuat
 * @returns Folder yang telah dibuat
 */
export const createFolder = async (
  user: UserModel,
  data: { name: string; slug?: string }
): Promise<FolderDetailResponse> => {
  let slug = data.slug;
  if (typeof data.slug !== 'string') {
    // Buat slug dari nama dengan mengganti spasi menjadi '-'
    slug = data.name.trim().toLowerCase().replace(/\s+/g, '-');
  } else {
    slug = data.slug.trim().toLowerCase();
  }

  const newFolder = await FolderRepository.create({
    name: data.name,
    slug,
    ownerId: user.id,
  });

  return {
    ...newFolder,
    createdAt: newFolder.createdAt.toISOString(),
    updatedAt: newFolder.updatedAt.toISOString(),
    assetCount: 0,
    tags: [],
  };
};
