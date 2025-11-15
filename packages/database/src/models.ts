import { Prisma } from '@prisma/client';

export interface UserModel {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface TagModel {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderModel {
  id: string;
  ownerId: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetModel {
  id: string;
  folderId: string;
  ownerId: number;
  publicId: string;
  name: string;
  slug: string;
  size: bigint;
  mimeType: string;

  url: string;
  format: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  metadata: Prisma.JsonValue;
}
