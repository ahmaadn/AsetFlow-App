import z from 'zod';

/**
 * Schema untuk login pengguna.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

/**
 * Schema untuk registrasi pengguna.
 */
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});
