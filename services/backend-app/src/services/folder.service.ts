import { UserModel } from '@asetflow/database';
import type {
  PaginationResult,
  FolderDetailResponse,
} from '@asetflow/shared-types';
import { CreateFolderType, UpdateFolderType } from '@asetflow/validators';

import * as FolderRepository from '../repositories/folder.repository';
import { QueryParams } from '../types/globals';
import { BadRequestError, NotFoundError } from '../utils/api-error';
import { ErrorCode } from '../utils/error-code';

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
    items: folders.map(({ _count, ...folder }) => ({
      ...folder,
      createdAt: folder.createdAt.toISOString(),
      updatedAt: folder.updatedAt.toISOString(),
      assetCount: _count.assets,
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
  data: CreateFolderType
): Promise<FolderDetailResponse> => {
  let slug = data.slug;
  if (typeof data.slug !== 'string') {
    // Buat slug dari nama dengan mengganti spasi menjadi '-'
    slug = data.name.trim().toLowerCase().replace(/\s+/g, '-');
  } else {
    slug = data.slug.trim().toLowerCase();
  }

  // cek slug sudah dipakai atau belum
  const existingFolder = await FolderRepository.findSlug(slug);
  if (existingFolder) {
    throw new BadRequestError({
      message: `Folder slug "${slug}" is already in use.`,
      errorCode: ErrorCode.FOLDER_SLUG_EXISTS,
    });
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

/**
 * Menhapus folder berdasarkan ID
 * @param folderId ID folder yang akan dihapus
 */
export const deleteFolder = async (folderId: string): Promise<void> => {
  const existingFolder = await FolderRepository.findById(folderId);
  if (!existingFolder) {
    throw new NotFoundError({
      message: `Folder with ID "${folderId}" does not exist.`,
      errorCode: ErrorCode.FOLDER_NOT_FOUND,
    });
  }

  await FolderRepository.deleteFolder(folderId);
};

/**
 * Menperbarui folder yang ada
 * @param folderId ID folder yang akan diupdate
 * @param data Data folder yang akan diupdate
 * @returns Folder yang telah diupdate
 */
export const updateFolder = async (
  folderId: string,
  data: UpdateFolderType
): Promise<FolderDetailResponse> => {
  // Cek apakah folder ada
  const existingFolder = await FolderRepository.findById(folderId);
  if (!existingFolder) {
    throw new NotFoundError({
      message: `Folder with ID "${folderId}" does not exist.`,
      errorCode: ErrorCode.FOLDER_NOT_FOUND,
    });
  }

  // jika slug diupdate, cek apakah sudah dipakai atau belum
  if (data.slug) {
    const slugInUse = await FolderRepository.findSlug(data.slug);
    if (slugInUse && slugInUse.id !== folderId) {
      throw new BadRequestError({
        message: `Folder slug "${data.slug}" is already in use.`,
        errorCode: ErrorCode.FOLDER_SLUG_EXISTS,
      });
    }
  }

  // TODO: cek tags apakah valid (ada di DB)
  // untuk sekarang tags tidak diupdate
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { tags, ...folderData } = data;

  const { _count, ...updatedFolder } = await FolderRepository.update(
    folderId,
    folderData
  );

  return {
    ...updatedFolder,
    createdAt: updatedFolder.createdAt.toISOString(),
    updatedAt: updatedFolder.updatedAt.toISOString(),
    assetCount: _count.assets,
    tags: [],
  };
};

/**
 * Mengecek apakah folder ada
 * @param folderId  ID folder yang akan dicek
 * @returns  Folder yang ditemukan
 */
export const checkFolder = async (folderId: string): Promise<boolean> => {
  const existingFolder = await FolderRepository.findById(folderId);
  if (!existingFolder) {
    return false;
  }

  return true;
};

/**
 * Mengambil folder berdasarkan ID
 * @param folderId ID folder yang akan diambil
 * @returns Folder yang ditemukan
 */
export const getFolderById = async (folderId: string) => {
  const folder = await FolderRepository.findById(folderId);
  if (!folder) {
    throw new NotFoundError({
      message: `Folder with ID "${folderId}" does not exist.`,
      errorCode: ErrorCode.FOLDER_NOT_FOUND,
    });
  }

  return folder;
};
