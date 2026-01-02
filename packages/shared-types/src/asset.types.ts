import { PaginationResponse } from './pagination.types';

interface BaseMetadataType {
  resource_type: string;
  version: number;
}

interface AssetBaseType {
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

// Types
// -------------------------
export interface MetadataImageType extends BaseMetadataType {
  width: number | null;
  height: number | null;
}

export interface MetadataDocumentType extends BaseMetadataType {
  // Page count untuk dokumen pdf. sayangnya docs tidak terdeteksi otomatis
  // oleh cloudinary
  pages?: number | null;
}

export interface MetadataVideoType extends BaseMetadataType {
  width: number;
  height: number;
  duration: number;
  bit_rate: number;
  frame_rate: number;
}

export interface MetadataAudioType extends BaseMetadataType {
  duration: number;
  bit_rate: number;
}

export type MetadataAssetType =
  | MetadataImageType
  | MetadataDocumentType
  | MetadataVideoType
  | MetadataAudioType;

export interface AssetType extends AssetBaseType {
  id: string;
  metadata: MetadataAssetType;
  createdAt: string;
  updatedAt: string;
}

// DTO
// -------------------------

export type CreateAssetDTO = Omit<AssetBaseType, 'viewCount'> & {
  metadata?: MetadataAssetType;
};

// Response types
// -------------------------

export type AssetResponse = AssetType;
export type AssetListResponse = PaginationResponse<AssetType>;
