import { AssetModel, type Prisma, prisma } from '@asetflow/database';
import { GeneralAssetType } from '@asetflow/shared';
import type { CreateAssetDTO } from '@asetflow/shared-types';

import { buildAssetTypeFilter } from '../utils/query-helper.js';

interface AssetQueryOptionsDTO {
  folderId: string;
  limit: number;
  offset: number;
  assetType?: GeneralAssetType | 'all';
  sort_by?: string;
  order?: 'asc' | 'desc';
}

interface AssetPaginationOptionsDTO {
  limit: number;
  offset: number;
  assetType: GeneralAssetType | 'all';
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface IAssetRepository {
  /**
   * Create a new Asset
   * @param data data for the new Asset
   * @returns Asset that has been created
   */
  create(data: CreateAssetDTO): Promise<AssetModel>;

  /**
   * Find an asset by ID
   * @param id Asset ID
   * @returns Asset found or null if not found
   */
  findById(id: string): Promise<AssetModel | null>;

  /**
   * Find an asset by slug
   * @param slug Asset slug
   * @returns Asset found or null if not found
   */
  findBySlug(slug: string): Promise<AssetModel | null>;

  /**
   * Check if an asset slug already exists within a specific folder
   * @param folderId Folder ID
   * @param slugAset Asset slug
   * @returns True if the slug already exists, false otherwise
   */
  checkSlugExists(folderId: string, slugAset: string): Promise<boolean>;

  /**
   * Get assets by folder with pagination and filter
   * @param options Filter and pagination options
   * @returns List of assets matching the  filter
   */
  getByFolderWithPagination(
    options: AssetQueryOptionsDTO
  ): Promise<AssetModel[]>;

  /**
   * Count total assets by folder
   * @param folderId Folder ID
   * @param assetType Asset type (optional)
   * @returns Total number of assets in the folder
   */
  countByFolder(
    folderId: string,
    assetType?: GeneralAssetType | 'all'
  ): Promise<number>;

  /**
   * Update asset by ID
   * @param id Asset ID
   * @param data Data to be updated
   * @returns Updated asset
   */
  update(id: string, data: Partial<AssetModel>): Promise<AssetModel>;

  /**
   * Count total assets by type
   * @param assetType Asset type (optional)
   * @returns Total number of assets of the specified type
   */
  countByType(assetType?: GeneralAssetType | 'all'): Promise<number>;

  /**
   * Delete asset by ID
   * @param id Asset ID
   */
  deleteById(id: string): Promise<void>;

  /**
   * Get assets by type with pagination and filter
   * @param options Filter and pagination options
   * @returns List of assets matching the filter
   */
  getByTypeWithPagination(
    options: AssetPaginationOptionsDTO
  ): Promise<AssetModel[]>;
}

class AssetRepository implements IAssetRepository {
  async create(data: CreateAssetDTO): Promise<AssetModel> {
    return await prisma.asset.create({
      data: {
        folderId: data.folderId,
        ownerId: data.ownerId,
        publicId: data.publicId,
        name: data.name,
        slug: data.slug,
        size: data.size,
        mimeType: data.mimeType,
        url: data.url,
        format: data.format,
        viewCount: 0,
        metadata: (data.metadata || {}) as Prisma.InputJsonValue,
      },
    });
  }

  async findById(id: string): Promise<AssetModel | null> {
    return await prisma.asset.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<AssetModel | null> {
    return await prisma.asset.findFirst({
      where: { slug },
    });
  }

  async checkSlugExists(folderId: string, slugAset: string): Promise<boolean> {
    const count = await prisma.asset.count({
      where: {
        folderId,
        slug: slugAset,
      },
    });
    return count > 0;
  }

  async getByFolderWithPagination(
    options: AssetQueryOptionsDTO
  ): Promise<AssetModel[]> {
    const { folderId, limit, offset, assetType, sort_by, order } = options;

    return await prisma.asset.findMany({
      where: {
        folderId,
        ...buildAssetTypeFilter(assetType),
      },
      take: limit,
      skip: offset,
      orderBy: {
        [sort_by || 'createdAt']: order || 'desc',
      },
    });
  }

  async countByFolder(
    folderId: string,
    assetType?: GeneralAssetType | 'all'
  ): Promise<number> {
    return await prisma.asset.count({
      where: {
        folderId,
        ...buildAssetTypeFilter(assetType),
      },
    });
  }

  async update(id: string, data: Partial<AssetModel>): Promise<AssetModel> {
    return await prisma.asset.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        updatedAt: new Date(),
      },
    });
  }

  async countByType(assetType?: GeneralAssetType | 'all'): Promise<number> {
    return await prisma.asset.count({
      where: {
        ...buildAssetTypeFilter(assetType),
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.asset.delete({
      where: { id },
    });
  }

  async getByTypeWithPagination(
    options: AssetPaginationOptionsDTO
  ): Promise<AssetModel[]> {
    const { limit, offset, assetType, sort_by, order } = options;

    return await prisma.asset.findMany({
      where: {
        ...buildAssetTypeFilter(assetType),
      },
      take: limit,
      skip: offset,
      orderBy: {
        [sort_by || 'createdAt']: order || 'desc',
      },
    });
  }
}

export const assetRepository = new AssetRepository();
export default assetRepository;
