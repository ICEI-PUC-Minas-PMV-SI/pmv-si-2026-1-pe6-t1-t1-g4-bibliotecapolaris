import path from 'path';
import { readFileSync } from 'fs';

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import 'dotenv/config';

const env = process.env.NODE_ENV ?? 'development';
const isLocal = env === 'development' || env === 'test';

function createPrismaClient(): PrismaClient {
  if (isLocal) {
    const dbPath = path.resolve(__dirname, '..', '..', 'prisma', 'test.db');
    const adapter = new PrismaBetterSqlite3({ url: dbPath });

    return new PrismaClient({ adapter });
  }

  const url = new URL(process.env.DATABASE_URL!);
  const sslCert = url.searchParams.get('sslcert');

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: sslCert ? { ca: readFileSync(sslCert) } : { rejectUnauthorized: true },
  });

  return new PrismaClient({ adapter });
}

export const prisma = createPrismaClient();
