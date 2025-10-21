import z from 'zod';

import { http } from '../http';

/**
 * Schema data murni, dapat digunakan untuk validasi form di frontend
 */
export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

/**
 * khusus schema untuk validasi HTTP request (Express middleware)
 */
export const httpLoginValidation = http({ body: loginSchema });
export const httpRegisterValidation = http({ body: registerSchema });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
