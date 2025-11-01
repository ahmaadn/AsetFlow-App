export type AsetCreate = {
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
  resourceType: string;
  width: number;
  height: number;
};

export type AsetResponse = {
  id: string;
  folderId: string;
  ownerId: number;
  publicId: string;
  originalName: string;
  slug: string;
  size: number;
  mimeType: string;
  assetType: string;
  url: string;
  format: string;
  resourceType: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
};

export interface AsetItem {
  id: string;
  folderId: string;
  ownerId: number;
  publicId: string;
  originalName: string;
  slug: string;
  size: number;
  mimeType: string;
  assetType: string;
  url: string;
  format: string;
  resourceType: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AsetListResponse {
  items: AsetItem[];
  total: number;
  page: number;
  per_page: number;
}
