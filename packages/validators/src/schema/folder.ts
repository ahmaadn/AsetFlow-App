import z from 'zod';

import { http } from '../http';

/**
 * Schema untuk mendapatkan daftar folder dengan pagination dan filter.
 */
export const getFoldersSchema = z.object({
  page: z.number().min(1).default(1).nullable(),
  per_page: z.number().min(1).max(100).default(20),
  search: z.string().optional().default(''),
  sort_by: z.enum(['createdAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema untuk membuat folder baru.
 */
export const createFolderSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9-_]+$/)
    .nullable(),
});

/**
 * khusus schema untuk validasi HTTP request (Express middleware)
 */
export const httpFoldersQuery = http({ query: getFoldersSchema });
export const httpCreateFolder = http({ body: createFolderSchema });

export type FoldersQueryInput = z.infer<typeof httpFoldersQuery>;
export type CreateFolderInput = z.infer<typeof httpCreateFolder>;
