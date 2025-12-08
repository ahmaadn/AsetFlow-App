/**
 * Environment configuration module with proper validation and loading strategy.
 *
 * Loading Strategy:
 * - Development: .env.local -> .env.development -> .env.dev -> .env (fallback)
 * - Production: .env.production -> .env.prod -> .env (fallback with warning)
 * - No NODE_ENV: .env only
 *
 * All environment variables are validated using Zod schema with sensible defaults.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import { z } from 'zod';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Zod schema for environment variable validation
 * Includes validation for all environment variables with sensible defaults
 */
const envSchema = z.object({
  // Application Configuration
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Application environment'),

  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, 'Port must be between 1 and 65535')
    .default(8000) // agar post tidak bentrok dengan nuxt
    .describe('Server port'),

  CORS_ORIGIN: z
    .string()
    .default('http://localhost:3000')
    .describe('CORS allowed origins'),

  // Database Configuration
  DATABASE_URL: z
    .url('DATABASE_URL must be a valid URL')
    .describe('Database connection URL'),

  // Better Auth Configuration
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
    .describe('Better Auth secret key'),

  BETTER_AUTH_URL: z
    .url('BETTER_AUTH_URL must be a valid URL')
    .default('http://localhost:8000') // URL backend default
    .describe('Better Auth base URL'),

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, 'CLOUDINARY_CLOUD_NAME is required')
    .describe('Cloudinary cloud name'),

  CLOUDINARY_API_KEY: z
    .string()
    .min(1, 'CLOUDINARY_API_KEY is required')
    .describe('Cloudinary API key'),

  CLOUDINARY_API_SECRET: z
    .string()
    .min(1, 'CLOUDINARY_API_SECRET is required')
    .describe('Cloudinary API secret'),

  CLOUDINARY_ROOT_FOLDER: z
    .string()
    .default('asetflow')
    .describe('Cloudinary root folder for uploads'),

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: z.string().optional().describe('Google OAuth client ID'),

  GOOGLE_CLIENT_SECRET: z
    .string()
    .optional()
    .describe('Google OAuth client secret'),

  // Email Service Configuration
  MAIL_SERVICE_PROVIDER: z
    .enum(['google', 'smtp'])
    .default('google')
    .describe('Email service provider'),

  // Google Email Configuration
  GOOGLE_APP_MAIL: z
    .email('GOOGLE_APP_MAIL must be a valid email')
    .optional()
    .describe('Google app email address'),

  GOOGLE_APP_PASSWORD: z.string().optional().describe('Google app password'),

  // SMTP Email Configuration
  SMTP_HOST: z.string().optional().describe('SMTP server host'),

  SMTP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) => val > 0 && val < 65536,
      'SMTP_PORT must be between 1 and 65535'
    )
    .optional()
    .describe('SMTP server port'),

  SMTP_SECURE: z
    .string()
    .transform((val) => val === 'true')
    .optional()
    .describe('SMTP secure connection'),

  SMTP_USER: z.string().optional().describe('SMTP username'),

  SMTP_PASS: z.string().optional().describe('SMTP password'),

  SMTP_FROM_NAME: z.string().default('AsetFlow').describe('Email sender name'),

  SMTP_FROM_ADDRESS: z
    .email('SMTP_FROM_ADDRESS must be a valid email')
    .optional()
    .describe('Email sender address'),

  // Logging Configuration
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'debug'])
    .default('info')
    .describe('Logging level'),
});

/**
 * Checks if a file exists at the given path
 */
const fileExists = (filePath: string): boolean => {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};

/**
 * Loads environment files based on NODE_ENV with proper fallback strategy
 */
const loadEnvironmentFiles = (): void => {
  const rootDir = path.resolve(__dirname, '../../');
  const nodeEnv = process.env.NODE_ENV;

  console.log(`[CONFIG] NODE_ENV detected: ${nodeEnv || 'undefined'}`);

  // If no NODE_ENV is set, load only .env
  if (!nodeEnv) {
    console.log('[CONFIG] No NODE_ENV set, loading .env only');
    const envPath = path.join(rootDir, '.env');
    if (fileExists(envPath)) {
      dotenv.config({ path: envPath });
      console.log('[CONFIG] ✓ Loaded .env');
    } else {
      dotenv.config(); // Load default .env behavior
      console.log('[WARN] [CONFIG] ⚠ No .env file found');
      console.log(
        '[CONFIG] Default dotenv behavior applied, environment variables must be set externally'
      );
    }
    return;
  }

  let envFiles: string[] = [];

  // Define env files based on NODE_ENV
  if (nodeEnv === 'development') {
    envFiles = ['.env.local', '.env.development', '.env.dev', '.env'];
    console.log(
      '[CONFIG] Development mode - checking env files in order of priority'
    );
  } else if (nodeEnv === 'production') {
    envFiles = ['.env.production', '.env.prod', '.env'];
    console.log(
      '[CONFIG] Production mode - checking env files in order of priority'
    );
  } else {
    // For any other NODE_ENV (test, staging, etc.)
    envFiles = [`.env.${nodeEnv}`, '.env'];
    console.log(
      `[CONFIG] ${nodeEnv} mode - checking env files in order of priority`
    );
  }

  // Load the first available env file
  let loaded = false;
  for (const envFile of envFiles) {
    const envPath = path.join(rootDir, envFile);
    if (fileExists(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`[CONFIG] ✓ Loaded ${envFile}`);
      // Check if we're using fallback .env in production
      if (nodeEnv === 'production' && envFile === '.env') {
        console.log(
          '[WARN] [CONFIG] ⚠ Using fallback .env in production - consider using .env.production or .env.prod'
        );
      }

      loaded = true;
      break;
    } else {
      console.log(`[CONFIG] ✗ ${envFile} not found`);
    }
  }

  if (!loaded) {
    console.log('[WARN] [CONFIG] ⚠ No environment files found');
  }
};

/**
 * Validates and transforms environment variables using Zod schema
 */
const validateEnvironment = () => {
  try {
    const parsed = envSchema.parse(process.env);
    console.log('[CONFIG] ✓ Environment variables validated successfully');
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n  ');

      console.log('[CONFIG] ✗ Environment validation failed:');
      console.log(`  ${formattedErrors}`);

      throw new Error(`Environment validation failed:\n  ${formattedErrors}`);
    }
    throw error;
  }
};

loadEnvironmentFiles();

export const env = {
  ...validateEnvironment(),
};

export const PORT = env.PORT;
