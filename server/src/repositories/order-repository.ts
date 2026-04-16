import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";

export function runInTransaction<T>(callback: (transaction: Prisma.TransactionClient) => Promise<T>) {
  return prisma.$transaction((transaction) => callback(transaction));
}
