import path from 'path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { activityDb: PrismaClient };

function createClient() {
  // prisma.config.ts is at project root, so prisma db push creates dev.db there.
  const dbFile = path.resolve(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbFile}`,
  });
  return new PrismaClient({ adapter });
}

export const activityDb = globalForPrisma.activityDb || createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.activityDb = activityDb;
}
