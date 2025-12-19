import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // We cannot pass datasourceUrl here if using prisma.config.ts in Prisma 7? 
    // Actually, Prisma Client usually picks it up from env or generated code.
    // For Prisma 7, it likely relies on the generated client to know how to connect via the adapter or config.
    // Standard setup:
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
