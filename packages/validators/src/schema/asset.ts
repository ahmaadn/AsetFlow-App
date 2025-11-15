import z from 'zod';

import { http } from '../http';
import { slug, UUIDv4 } from './base';

/**
 * Schema untuk mendapatkan daftar asset dengan pagination dan filter
 */
export const getAssetsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  assetType: z
    .enum(['image', 'video', 'audio', 'document', 'all'])
    .optional()
    .default('all'),
  sort_by: z.enum(['createdAt', 'name', 'size']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const getAssetsByTypeSchema = getAssetsSchema.extend({
  assetType: z
    .enum(['image', 'video', 'audio', 'document', 'all'])
    .default('all'),
});

/**
 * Schema untuk update asset
 */
export const updateAssetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
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
 * Schema untuk HTTP request get assets by type
 */
export const httpGetAssetsByType = http({
  query: getAssetsByTypeSchema,
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

export type GetAssetsByTypeType = z.infer<typeof getAssetsByTypeSchema>;

export type HttpGetAssetsInput = z.infer<typeof httpGetAssets>;
