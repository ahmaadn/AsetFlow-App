import { type FolderModel, prisma } from '@asetflow/database';

// interface FolderQueryOptionsDTO {
//   where: {
//     ownerId: string;
//     name?: {
//       $like: string;
//     };
//   };
//   limit: number;
//   offset: number;
//   sort_by?: string;
//   order?: 'asc' | 'desc';
// }

interface CreateFolderDTO {
  name: string;
  ownerId: string;
  slug: string;
}

interface UpdateFolderDTO {
  name?: string;
  slug?: string;
}

interface FolderWithAssetCountQuery extends FolderModel {
  _count: {
    assets: number;
  };
}

interface FolderQueryOptionsDTO {
  ownerId: string;
  searchQuery?: string;
  limit: number;
  offset: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface IFolderRepository {
  /**
   * get all folders.
   * @returns List of all folders
   */
  getAll(): Promise<FolderModel[]>;

  /**
   * Get folders by filter.
   * @param options Filter options
   * @returns Folders that match the filter
   */
  getByFilter(
    options: FolderQueryOptionsDTO
  ): Promise<FolderWithAssetCountQuery[]>;

  /**
   * Create a new folder.
   * @param data Data for the new folder
   * @returns The created folder
   */
  create(data: CreateFolderDTO): Promise<FolderModel>;

  /**
   * Delete a folder by ID.
   * @param folderId ID of the folder to delete
   */
  deleteFolder(folderId: string): Promise<void>;

  /**
   * Update a folder by ID.
   * @param folderId ID of the folder to update
   * @param data Data of the folder to update
   * @returns The updated folder
   */
  update(
    folderId: string,
    data: UpdateFolderDTO
  ): Promise<FolderWithAssetCountQuery>;

  /**
   * Find a folder by slug.
   * @param slug  Folder slug
   * @returns The found folder or null
   */
  findSlug(slug: string): Promise<FolderModel | null>;

  /**
   * Find a folder by ID.
   * @param id Folder ID
   * @returns The found folder or null
   */
  findById(id: string): Promise<FolderModel | null>;

  /**
   * Count folders by owner ID.
   * @param ownerId Owner ID
   */
  countFoldersByOwner(
    query: Pick<FolderQueryOptionsDTO, 'ownerId' | 'searchQuery'>
  ): Promise<number>;
}

/**
 * Folder Repository Implementation
 */
class FolderRepository implements IFolderRepository {
  async getAll(): Promise<FolderModel[]> {
    return await prisma.folder.findMany();
  }

  async getByFilter(
    options: FolderQueryOptionsDTO
  ): Promise<FolderWithAssetCountQuery[]> {
    const { ownerId, searchQuery, limit, offset, sort_by, order } = options;

    return await prisma.folder.findMany({
      where: {
        ownerId: ownerId,
        ...(searchQuery ? { name: { contains: searchQuery } } : {}),
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
  }

  async create(data: CreateFolderDTO): Promise<FolderModel> {
    return await prisma.folder.create({
      data,
    });
  }

  async deleteFolder(folderId: string): Promise<void> {
    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
  }

  async update(
    folderId: string,
    data: UpdateFolderDTO
  ): Promise<FolderWithAssetCountQuery> {
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
  }

  async findSlug(slug: string): Promise<FolderModel | null> {
    return await prisma.folder.findUnique({
      where: {
        slug,
      },
    });
  }

  async findById(id: string): Promise<FolderModel | null> {
    return await prisma.folder.findUnique({
      where: {
        id,
      },
    });
  }

  async countFoldersByOwner({
    ownerId,
    searchQuery,
  }: Pick<FolderQueryOptionsDTO, 'ownerId' | 'searchQuery'>): Promise<number> {
    return await prisma.folder.count({
      where: {
        ownerId,
        ...(searchQuery ? { name: { contains: searchQuery } } : {}),
      },
    });
  }
}

export const folderRepository = new FolderRepository();
export default folderRepository;
