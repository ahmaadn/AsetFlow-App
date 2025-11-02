export interface AssetBase {
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
}

export type AssetCreate = AssetBase & {
  width: number;
  height: number;
};

export interface Asset extends AssetBase {
  id: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export type AssetResponse = Asset;
export type AssetItem = Asset;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export type AssetListResponse = Paginated<Asset>;
