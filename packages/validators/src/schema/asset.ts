import z from 'zod';

import { http } from '../http';
import { slug, UUIDv4 } from './base';

/**
 * Schema untuk mendapatkan daftar asset dengan pagination dan filter
 */
export const getAssetsSchema = z.object({
  page: z.coerce.number().min(1).default(1).nullable(),
  per_page: z.coerce.number().min(1).max(100).default(20),
  assetType: z.string().optional(),
  sort_by: z.enum(['createdAt', 'originalName', 'size']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema untuk update asset
 */
export const updateAssetSchema = z.object({
  originalName: z.string().min(1).max(255).optional(),
  slug: slug.optional(),
});

/**
 * Schema untuk HTTP request get assets by folder
 */
export const httpGetAssets = http({
  query: getAssetsSchema,
  params: z.object({ id: UUIDv4 }),
});

/**
 * Schema untuk HTTP request update asset
 */
export const httpUpdateAsset = http({
  body: updateAssetSchema,
  params: z.object({ id: UUIDv4 }),
});

/**
 * Schema untuk HTTP request asset by ID
 */
export const httpParamsAsset = http({
  params: z.object({ id: UUIDv4 }),
});

export type HttpUpdateAssetInput = z.infer<typeof httpUpdateAsset>;

export type UpdateAssetType = z.infer<typeof updateAssetSchema>;

export type GetAssetsType = z.infer<typeof getAssetsSchema>;
export type HttpGetAssetsInput = z.infer<typeof httpGetAssets>;
