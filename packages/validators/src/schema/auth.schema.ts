import z from 'zod';

import { http } from '../http';

/**
 * Schema for authentication
 */

export const LoginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const RegisterSchema = z
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
export const ForgetPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  redirectUrl: z.url({ message: 'Invalid redirect URL' }).optional(),
});

/**
 * Schema for reset password
 */
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password must be at most 128 characters long' }),
});

/**
 * Common password validation schema
 */
export const PasswordValidationSchema = z
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

export const RequestEmailSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

/**
 * Schema for HTTP request/response validation
 */
export const httpLoginSchema = http({ body: LoginSchema });
export const httpRegisterSchema = http({ body: RegisterSchema });

export const httpForgetPasswordSchema = http({
  body: ForgetPasswordSchema,
});
export const httpResetPasswordSchema = http({
  body: ResetPasswordSchema,
});

/**
 * Types Schema
 */
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgetPasswordInput = z.infer<typeof ForgetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type RequestEmailInput = z.infer<typeof RequestEmailSchema>;
