import z from 'zod';

import { http } from '../http';

/**
 * Schema for authentication
 */

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(256, { message: 'Password must be at most 256 characters long' }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters long',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Scheme for forget password request
 */
export const forgetPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  redirectUrl: z.url({ message: 'Invalid redirect URL' }).optional(),
});

/**
 * Schema for reset password
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' }),
});

/**
 * Common password validation schema
 */
export const passwordValidationSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(128, { message: 'Password must be at most 128 characters long' }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters long',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Schema for HTTP request/response validation
 */
export const httpLoginSchema = http({ body: loginSchema });
export const httpRegisterSchema = http({ body: registerSchema });

export const httpForgetPasswordSchema = http({
  body: forgetPasswordSchema,
});
export const httpResetPasswordSchema = http({
  body: resetPasswordSchema,
});

/**
 * Types Schema
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type forgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;
