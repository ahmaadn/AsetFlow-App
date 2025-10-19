import { SimpleTag } from './tag.types';

export type FolderDetailResponse = {
  id: string;
  ownerId: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  assetCount: number;
  tags: SimpleTag[];
};
