import path from 'path';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import { PrismaClient } from '../../prisma/generated/test/client';

const testDbPath = path.resolve(__dirname, '..', '..', 'prisma', 'test.db');

const adapter = new PrismaBetterSqlite3({ url: testDbPath });

export const prisma = new PrismaClient({ adapter });
