// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// Extend the NodeJS global type to avoid multiple instances of PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma as PrismaClient;
