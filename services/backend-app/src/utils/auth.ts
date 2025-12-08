import { prisma } from '@asetflow/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { createEmailService } from '../services/email/email.service.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  basePath: '/v1/auth',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8000',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    'http://localhost:3000',
    process.env.CORS_ORIGIN,
    process.env.VERCEL_URL || '',
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  advanced: {
    cookies: {
      session_token: {
        name: 'better-auth.session-token',
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          domain: process.env.NODE_ENV === 'production' ? undefined : undefined,
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      const emailService = createEmailService();
      await emailService.sendForgotPasswordEmail(user.email, {
        userName: user.name || 'User',
        resetUrl: url,
        expirationTime: '1 hour',
      });
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET && {
        google: {
          prompt: 'select_account',
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          disableSignUp: true,
        },
      }),
  },
  logger: {
    disabled: false,
  },
});
