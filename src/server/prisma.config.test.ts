import path from 'path';
import { defineConfig } from 'prisma/config';

const testDbPath = path.resolve(__dirname, 'prisma', 'test.db');

export default defineConfig({
  schema: 'prisma/schema.prisma.dev',
  migrations: {
    path: 'prisma/migrations.dev',
  },
  datasource: {
    url: `file:${testDbPath}`,
  },
});
