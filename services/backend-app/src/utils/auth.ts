import { prisma } from '@asetflow/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { logger } from '../configs/logger.config.js';
import { createEmailService } from '../services/email/email.service.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  basePath: '/v1/auth',
  trustedOrigins: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
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
    log: (level, message, ...args) => {
      const logMethod = logger[level] || logger.info;
      logMethod(message, ...args);
    },
  },
});
