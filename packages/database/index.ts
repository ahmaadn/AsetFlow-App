// packages/database/index.ts
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export * from '@prisma/client';
export * from './src/helper';
export * from './src/models';
