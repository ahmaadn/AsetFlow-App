import { SimpleTag } from './tag.types';

type BaseFolder = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type FolderItem = BaseFolder & {
  assetCount: number;
  tags: SimpleTag[];
};

export type FolderDetailResponse = FolderItem;

export type SimpleFolderResponse = BaseFolder;
