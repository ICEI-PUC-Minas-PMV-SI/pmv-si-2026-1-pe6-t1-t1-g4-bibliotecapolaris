import path from 'path';

import { PrismaClient } from '../../prisma/generated/test/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const testDbPath = path.resolve(__dirname, '..', '..', 'prisma', 'test.db');

const adapter = new PrismaBetterSqlite3({ url: testDbPath });

export const prisma = new PrismaClient({ adapter });
