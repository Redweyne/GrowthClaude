import path from 'path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { activityDb: PrismaClient };

function createClient() {
  // Prisma CLI creates the DB relative to the schema directory (prisma/).
  // At runtime, resolve to an absolute path so it works regardless of CWD.
  const dbFile = path.resolve(process.cwd(), 'prisma', 'dev.db');
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbFile}`,
  });
  return new PrismaClient({ adapter });
}

export const activityDb = globalForPrisma.activityDb || createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.activityDb = activityDb;
}
