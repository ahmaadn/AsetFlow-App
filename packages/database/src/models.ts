export interface UserModel {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagModel {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderModel {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetModel {
  id: string;
  folderId: string;
  ownerId: string;
  originalName: string;
  slug: string;
  fileSizeBytes: bigint;
  mimeType: string;
  assetType: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CloudinaryAssetModel {
  id: string;
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  updated_at: string;
  bytes: number;
  type: string;
  url: string;
  secureUrl: string;
  tags: string[];
  secure_url: string;
}
