import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill in the database connection strings.');
  }

  const adapter = new PrismaPg({
    connectionString,
    // node-postgres waits indefinitely by default; fail fast when the database is unreachable.
    connectionTimeoutMillis: 5_000,
  });

  return new PrismaClient({ adapter });
}

// Kept on globalThis so development hot reloads reuse the client instead of opening a new pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * The shared Prisma Client. Created on first use, not on import, so building the app does not
 * require the database URL.
 */
export function getPrisma(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}
