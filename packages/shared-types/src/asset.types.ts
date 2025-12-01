import { PaginationResult } from './pagination.types';

interface BaseMetadata {
  resource_type: string;
  version: number;
}

export interface MetadataImage extends BaseMetadata {
  width: number | null;
  height: number | null;
}

export interface MetadataDocument extends BaseMetadata {
  // Page count untuk dokumen pdf. sayangnya docs tidak terdeteksi otomatis
  // oleh cloudinary
  pages?: number | null;
}

export interface MetadataVideo extends BaseMetadata {
  width: number;
  height: number;
  duration: number;
  bit_rate: number;
  frame_rate: number;
}

export interface MetadataAudio extends BaseMetadata {
  duration: number;
  bit_rate: number;
}

export type MetadataAsset =
  | MetadataImage
  | MetadataDocument
  | MetadataVideo
  | MetadataAudio;

export interface AssetBase {
  folderId: string;
  ownerId: string;
  publicId: string;
  name: string;
  slug: string;
  size: number;
  mimeType: string;
  url: string;
  format: string;
  viewCount: number;
}

export type AssetCreate = Omit<AssetBase, 'viewCount'> & {
  metadata?: MetadataAsset;
};

export interface Asset extends AssetBase {
  id: string;
  metadata: MetadataAsset;
  createdAt: string;
  updatedAt: string;
}

export type AssetResponse = Asset;
export type AssetItem = Asset;

export type AssetListResponse = PaginationResult<Asset>;
