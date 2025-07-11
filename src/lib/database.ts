import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global var declarations for Prisma client
  var prisma: PrismaClient | undefined;
}

// Singleton pattern for Prisma client to prevent multiple instances
export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
