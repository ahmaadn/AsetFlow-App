import { ErrorCode } from '@asetflow/shared';
import type {
  PaginationResult,
  FolderDetailResponse,
} from '@asetflow/shared-types';
import type {
  CreateFolderType,
  GetFolderType,
  UpdateFolderType,
} from '@asetflow/validators';

import logger from '../configs/logger.config.js';
import type { IFolderRepository } from '../repositories/folder.repository.js';
import { BadRequestError, NotFoundError } from '../utils/api-error.js';

export class FolderService {
  private folderRepository: IFolderRepository;

  constructor(folderRepository: IFolderRepository) {
    this.folderRepository = folderRepository;
  }

  /**
   * Mendapatkan semua folder milik user
   * @param user Pemilik folder
   * @param param1 Opsi untuk mendapatkan folder
   * @returns Daftar folder
   */
  async getAllFolders(
    user_id: string,
    {
      page = 1,
      per_page = 20,
      search = '',
      sort_by = 'createdAt',
      order = 'desc',
    }: Partial<GetFolderType>
  ): Promise<PaginationResult<FolderDetailResponse>> {
    logger.info(
      `Fetching folders for user ID: ${user_id}, Page: ${page}, Per Page: ${per_page}, Search: "${search}", Sort By: ${sort_by}, Order: ${order}`
    );

    // Mengambil folder dari repository
    const folders = await this.folderRepository.getByFilter({
      where: {
        ownerId: user_id,
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
  }

  /**
   * Membuat folder baru
   * @param user Pemilik folder
   * @param data Data folder yang akan dibuat
   * @returns Folder yang telah dibuat
   */
  async createFolder(
    user_id: string,
    data: CreateFolderType
  ): Promise<FolderDetailResponse> {
    let slug = data.slug;
    if (typeof data.slug !== 'string') {
      // Buat slug dari nama dengan mengganti spasi menjadi '-'
      slug = data.name.trim().toLowerCase().replace(/\s+/g, '-');
    } else {
      slug = data.slug.trim().toLowerCase();
    }

    // cek slug sudah dipakai atau belum
    const existingFolder = await this.folderRepository.findSlug(slug);
    if (existingFolder) {
      throw new BadRequestError({
        message: `Folder slug "${slug}" is already in use.`,
        errorCode: ErrorCode.FOLDER_SLUG_EXISTS,
      });
    }

    const newFolder = await this.folderRepository.create({
      name: data.name,
      slug,
      ownerId: user_id,
    });

    return {
      ...newFolder,
      createdAt: newFolder.createdAt.toISOString(),
      updatedAt: newFolder.updatedAt.toISOString(),
      assetCount: 0,
      tags: [],
    };
  }

  /**
   * Menhapus folder berdasarkan ID
   * @param folderId ID folder yang akan dihapus
   */
  async deleteFolder(folderId: string): Promise<void> {
    const existingFolder = await this.folderRepository.findById(folderId);
    if (!existingFolder) {
      throw new NotFoundError({
        message: `Folder with ID "${folderId}" does not exist.`,
        errorCode: ErrorCode.FOLDER_NOT_FOUND,
      });
    }

    await this.folderRepository.deleteFolder(folderId);
  }

  /**
   * Menperbarui folder yang ada
   * @param folderId ID folder yang akan diupdate
   * @param data Data folder yang akan diupdate
   * @returns Folder yang telah diupdate
   */
  async updateFolder(
    folderId: string,
    data: UpdateFolderType
  ): Promise<FolderDetailResponse> {
    // Cek apakah folder ada
    const existingFolder = await this.folderRepository.findById(folderId);
    if (!existingFolder) {
      throw new NotFoundError({
        message: `Folder with ID "${folderId}" does not exist.`,
        errorCode: ErrorCode.FOLDER_NOT_FOUND,
      });
    }

    // jika slug diupdate, cek apakah sudah dipakai atau belum
    if (data.slug) {
      const slugInUse = await this.folderRepository.findSlug(data.slug);
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

    const { _count, ...updatedFolder } = await this.folderRepository.update(
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
  }

  /**
   * Mengecek apakah folder ada
   * @param folderId  ID folder yang akan dicek
   * @returns  Folder yang ditemukan
   */
  async checkFolder(folderId: string): Promise<boolean> {
    const existingFolder = await this.folderRepository.findById(folderId);
    if (!existingFolder) {
      return false;
    }

    return true;
  }

  /**
   * Mengambil folder berdasarkan ID
   * @param folderId ID folder yang akan diambil
   * @returns Folder yang ditemukan
   */
  async getFolderById(folderId: string) {
    const folder = await this.folderRepository.findById(folderId);
    if (!folder) {
      throw new NotFoundError({
        message: `Folder with ID "${folderId}" does not exist.`,
        errorCode: ErrorCode.FOLDER_NOT_FOUND,
      });
    }

    return folder;
  };
}
