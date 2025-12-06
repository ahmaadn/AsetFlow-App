import { prisma } from '@asetflow/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { logger } from '../configs/logger.config';
import { emailService } from '../services/email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  basePath: '/v1/auth',
  trustedOrigins: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await emailService.sendForgotPasswordEmail(user.email, {
        userName: user.name || 'User',
        resetUrl: url,
        expirationTime: '1 hour',
      });
    },
    onPasswordReset: async ({ user }) => {
      await emailService.sendWelcomeEmail(user.email, {
        userName: user.name || 'User',
        userEmail: user.email,
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
    log: (level, message, ...args) => {
      const logMethod = logger[level] || logger.info;
      logMethod(message, args);
    },
  },
});
