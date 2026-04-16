import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";

export function findProducts(args?: Prisma.ProductFindManyArgs) {
  return prisma.product.findMany(args);
}

export function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
}
