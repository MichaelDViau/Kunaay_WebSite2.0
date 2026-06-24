import { PrismaClient } from '@/generated/prisma/client';
import { createDatabaseAdapter } from '@/lib/db-adapter';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: createDatabaseAdapter() });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
