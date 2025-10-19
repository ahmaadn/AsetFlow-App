import z from 'zod';

/**
 * Schema untuk mendapatkan daftar folder dengan pagination dan filter.
 */
export const getFoldersSchema = z.object({
  query: z.object({
    page: z.number().min(1).default(1).nullable(),
    per_page: z.number().min(1).max(100).default(20),
    search: z.string().optional().default(''),
    sort_by: z.enum(['createdAt', 'name']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const createFolderSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-zA-Z0-9-_]+$/)
      .nullable(),
  }),
});
