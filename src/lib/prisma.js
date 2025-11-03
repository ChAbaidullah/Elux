import { PrismaClient } from '@prisma/client';

// Prevent multiple client instances in dev (Next.js hot reload)
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;

export default prisma;
