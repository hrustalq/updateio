import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var prisma: PrismaClient | undefined;
}

const prismaClient = new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export const prisma = global.prisma || prismaClient;

export * from '@prisma/client'; 