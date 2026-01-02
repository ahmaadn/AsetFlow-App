import { SimpleTagType } from './tag.types';

interface BaseFolder {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Types
// -------------------------

export interface FolderItemType extends BaseFolder {
  assetCount: number;
  tags: SimpleTagType[];
}

// Responses Types
// -------------------------

export type FolderDetailResponse = FolderItemType;

export type SimpleFolderResponse = BaseFolder;
