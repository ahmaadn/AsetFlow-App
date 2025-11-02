export interface AsetBase {
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
}

export type AsetCreate = AsetBase & {
  width: number;
  height: number;
};

export interface Aset extends AsetBase {
  id: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export type AsetResponse = Aset;
export type AsetItem = Aset;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export type AsetListResponse = Paginated<Aset>;
