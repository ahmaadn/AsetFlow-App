import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../prisma/generated/client';

const connectionString = process.env.DATABASE_URL || '';
const sslMode =
  process.env.NODE_ENV === 'production'
    ? ''
    : '&sslmode=require&sslaccept=accept_invalid_certs';
const finalConnectionString = connectionString.includes('?')
  ? `${connectionString}${sslMode}`
  : `${connectionString}?${sslMode.substring(1)}`;

export const adapter = new PrismaPg({
  connectionString: finalConnectionString,
  ssl: process.env.NODE_ENV !== 'production' ? false : undefined,
});
export const prisma = new PrismaClient({ adapter });
