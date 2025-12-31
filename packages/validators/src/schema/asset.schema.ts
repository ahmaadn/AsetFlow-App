import z from 'zod';

import { http } from '../http';
import { slugSchema, UUIDv4Schema } from './base.schema';

/**
 * Schema untuk mendapatkan daftar asset dengan pagination dan filter
 */
export const GetAssetsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  assetType: z
    .enum(['image', 'video', 'audio', 'document', 'all'])
    .optional()
    .default('all'),
  sort_by: z.enum(['createdAt', 'name', 'size']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const GetAssetsByTypeSchema = GetAssetsSchema.extend({
  assetType: z
    .enum(['image', 'video', 'audio', 'document', 'all'])
    .default('all'),
});

/**
 * Schema untuk update asset
 */
export const UpdateAssetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: slugSchema.optional(),
});

/**
 * Schema untuk HTTP request get assets by folder
 */
export const httpGetAssetsSchema = http({
  query: GetAssetsSchema,
  params: z.object({ id: UUIDv4Schema }),
});

/**
 * Schema untuk HTTP request get assets by type
 */
export const httpGetAssetsByTypeSchema = http({
  query: GetAssetsByTypeSchema,
});

/**
 * Schema untuk HTTP request update asset
 */
export const httpUpdateAssetSchema = http({
  body: UpdateAssetSchema,
  params: z.object({ id: UUIDv4Schema }),
});

/**
 * Schema untuk HTTP request asset by ID
 */
export const httpParamsAssetSchema = http({
  params: z.object({ id: UUIDv4Schema }),
});

export type httpUpdateAssetInput = z.infer<typeof httpUpdateAssetSchema>;

export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;

export type GetAssetsInput = z.infer<typeof GetAssetsSchema>;

export type GetAssetsByTypeInput = z.infer<typeof GetAssetsByTypeSchema>;

export type httpGetAssetsInput = z.infer<typeof httpGetAssetsSchema>;
