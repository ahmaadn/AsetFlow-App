import z from 'zod';

import { http } from '../http';
import { slugSchema, UUIDv4Schema } from './base.schema';

export const UploadSchema = z.object({
  filename: z.string().min(3, 'Name must be at least 3 characters'),
  slug: slugSchema.optional(),
});

export type UploadInput = z.infer<typeof UploadSchema>;

export const httpUploadSchema = http({
  body: UploadSchema,
  params: z.object({ id: UUIDv4Schema }),
});

export type httpUploadInput = z.infer<typeof httpUploadSchema>;
