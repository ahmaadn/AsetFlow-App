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
  originalName: string;
  slug: string;
  size: string;
  mimeType: string;
  assetType: string;
  url: string;
  format: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  width: number;
  height: number;
}
