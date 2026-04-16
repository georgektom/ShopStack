import { prisma } from "../db/prisma.js";

export function createCart() {
  return prisma.cart.create({
    data: {},
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
}

export function findCartById(id: string) {
  return prisma.cart.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: {
          createdAt: "asc"
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
}

export function upsertCartItem(cartId: string, productId: string, quantity: number) {
  return prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId,
        productId
      }
    },
    create: {
      cartId,
      productId,
      quantity
    },
    update: {
      quantity
    }
  });
}

export function deleteCartItem(cartId: string, productId: string) {
  return prisma.cartItem.deleteMany({
    where: {
      cartId,
      productId
    }
  });
}
