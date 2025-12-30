import path from 'path';
import 'dotenv/config';

import { type PrismaConfig, env } from 'prisma/config';

export default {
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
  },
  views: {
    path: path.join('prisma', 'views'),
  },
  typedSql: {
    path: path.join('prisma', 'queries'),
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
} satisfies PrismaConfig;
