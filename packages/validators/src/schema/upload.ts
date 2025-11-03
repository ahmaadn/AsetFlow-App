import z from 'zod';

import { http } from '../http';
import { slug, UUIDv4 } from './base';

export const uploadSchema = z.object({
  filename: z.string().min(3, 'Name must be at least 3 characters'),
  slug: slug.optional(),
});

export type UploadType = z.infer<typeof uploadSchema>;

export const httpUpload = http({
  body: uploadSchema,
  params: z.object({ id: UUIDv4 }),
});

export type UploadInput = z.infer<typeof httpUpload>;
