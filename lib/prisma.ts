import { PrismaClient } from "@prisma/client";
import { env } from "./env";
// Validate DB url early — Prisma itself reads DATABASE_URL from process.env,
// but we validate format/length via env to give clear errors (see lib/env.ts).
void env.DATABASE_URL;
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
