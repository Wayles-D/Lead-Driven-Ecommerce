/**
 * Centralized Prisma Client Instance
 * 
 * Single source of truth for database access.
 * Prevents multiple client instances and connection leaks.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prevent Prisma from connecting during build
const isBuilding = process.env.NEXT_PHASE === "phase-production-build";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Prevent connection during build
    datasources: isBuilding
      ? undefined
      : {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
  });

if (process.env.NODE_ENV !== "production" && !isBuilding) {
  globalForPrisma.prisma = prisma;
}