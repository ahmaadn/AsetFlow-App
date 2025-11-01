import z from 'zod';

import { http } from '../http';
import { folderId } from './folder';

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
 * Schema untuk HTTP request get assets by folder
 */
export const httpGetAssets = http({
  query: getAssetsSchema,
  params: z.object({ id: folderId }),
});

export type GetAssetsType = z.infer<typeof getAssetsSchema>;
export type HttpGetAssetsInput = z.infer<typeof httpGetAssets>;
