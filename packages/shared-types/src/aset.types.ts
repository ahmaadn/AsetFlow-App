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
  size: string;
  mimeType: string;
  assetType: string;
  url: string;
  format: string;
  resourceType: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};
