import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

<<<<<<< HEAD:apps/backend/server/src/lib/prisma.ts
// eslint-disable-next-line import/no-unresolved
import { PrismaClient } from '../../prisma/generated/prisma/client';
=======
import { PrismaClient } from '@prisma/client';
>>>>>>> server:src/server/src/lib/prisma.ts

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({
  adapter,
  errorFormat: 'pretty',
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

export { prisma };
