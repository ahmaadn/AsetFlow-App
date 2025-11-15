import z from 'zod';

import { http } from '../http';
import { slug, UUIDv4 } from './base';

/**
 * Schema untuk mendapatkan daftar folder dengan pagination dan filter.
 */
export const getFoldersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional().default(''),
  sort_by: z.enum(['createdAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema untuk membuat folder baru.
 */
export const createFolderSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slug.optional(),
});

/**
 * Schema untuk memperbarui folder.
 */
export const updateFolderSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: slug.optional(),
  tags: z.array(z.uuid({ version: 'v4' })).optional(),
});

export type GetFolderType = z.infer<typeof getFoldersSchema>;
export type CreateFolderType = z.infer<typeof createFolderSchema>;
export type UpdateFolderType = z.infer<typeof updateFolderSchema>;

/**
 * khusus schema untuk validasi HTTP request (Express middleware)
 */
export const httpFoldersQuery = http({ query: getFoldersSchema });
export const httpCreateFolder = http({ body: createFolderSchema });
export const httpUpdateFolder = http({
  body: updateFolderSchema,
  params: z.object({ id: UUIDv4 }),
});

export const httpCheckFolder = http({
  params: z.object({ id: UUIDv4 }),
});

export type FoldersQueryInput = z.infer<typeof httpFoldersQuery>;
export type CreateFolderInput = z.infer<typeof httpCreateFolder>;
export type UpdateFolderInput = z.infer<typeof httpUpdateFolder>;
export type CheckFolderInput = z.infer<typeof httpCheckFolder>;
