import z from 'zod';

import { http } from '../http';
import { slugSchema, UUIDv4Schema } from './base.schema';

/**
 * Schema untuk mendapatkan daftar folder dengan pagination dan filter.
 */
export const GetFoldersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional().default(''),
  sort_by: z.enum(['createdAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema untuk membuat folder baru.
 */
export const CreateFolderSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema.optional(),
});

/**
 * Schema untuk memperbarui folder.
 */
export const UpdateFolderSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: slugSchema.optional(),
  tags: z.array(z.uuid({ version: 'v4' })).optional(),
});

export type GetFolderInput = z.infer<typeof GetFoldersSchema>;
export type CreateFolderInput = z.infer<typeof CreateFolderSchema>;
export type UpdateFolderInput = z.infer<typeof UpdateFolderSchema>;

/**
 * khusus schema untuk validasi HTTP request (Express middleware)
 */
export const httpFoldersQuerySchema = http({ query: GetFoldersSchema });
export const httpCreateFolderSchema = http({ body: CreateFolderSchema });
export const httpUpdateFolderSchema = http({
  body: UpdateFolderSchema,
  params: z.object({ id: UUIDv4Schema }),
});

export const httpCheckFolderSchema = http({
  params: z.object({ id: UUIDv4Schema }),
});

export type httpFoldersQueryInput = z.infer<typeof httpFoldersQuerySchema>;
export type httpCreateFolderInput = z.infer<typeof httpCreateFolderSchema>;
export type httpUpdateFolderInput = z.infer<typeof httpUpdateFolderSchema>;
export type httpCheckFolderInput = z.infer<typeof httpCheckFolderSchema>;
