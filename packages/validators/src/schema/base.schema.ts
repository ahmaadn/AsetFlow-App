import z from 'zod';

export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens (no leading/trailing hyphens or consecutive hyphens)'
  );

export const UUIDv4Schema = z.uuid({ version: 'v4' });
