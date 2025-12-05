import { prisma } from '@asetflow/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  basePath: '/v1/auth',
  trustedOrigins: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
  emailAndPassword: {
    enabled: true,
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
});
