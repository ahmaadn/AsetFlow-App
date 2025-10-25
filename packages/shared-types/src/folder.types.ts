import { SimpleTag } from './tag.types';

export type FolderItem = {
  id: string;
  ownerId: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  assetCount: number;
  tags: SimpleTag[];
};

export type FolderDetailResponse = FolderItem;
