import z from 'zod';

import { http } from '../http';
import { folderId } from './folder';

export const uploadSchema = z.object({
  filename: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .optional(),
});

export type UploadType = z.infer<typeof uploadSchema>;

export const httpUpload = http({
  body: uploadSchema,
  params: z.object({ id: folderId }),
});

export type UploadInput = z.infer<typeof httpUpload>;
