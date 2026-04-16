import { prisma } from "../db/prisma.js";
import {
  createCart,
  deleteCartItem,
  findCartById,
  upsertCartItem
} from "../repositories/cart-repository.js";
import { AppError } from "../utils/app-error.js";
import { serializeCart } from "../utils/cart-response.js";

async function ensureCart(cartId?: string) {
  if (cartId) {
    const existingCart = await findCartById(cartId);

    if (existingCart) {
      return existingCart;
    }
  }

  return createCart();
}

async function getProductForCart(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  }

  return product;
}

export async function getCart(cartId?: string) {
  const cart = await ensureCart(cartId);
  return serializeCart(cart);
}

export async function addCartItem(productId: string, quantity: number, cartId?: string) {
  const cart = await ensureCart(cartId);
  const product = await getProductForCart(productId);
  const currentItem = cart.items.find((item) => item.productId === productId);
  const nextQuantity = (currentItem?.quantity ?? 0) + quantity;

  if (nextQuantity > product.inventoryCount) {
    throw new AppError(400, "INSUFFICIENT_INVENTORY", "Requested quantity exceeds inventory.", {
      available: product.inventoryCount
    });
  }

  await upsertCartItem(cart.id, productId, nextQuantity);
  const freshCart = await findCartById(cart.id);

  if (!freshCart) {
    throw new AppError(500, "CART_NOT_FOUND", "Cart could not be loaded after update.");
  }

  return serializeCart(freshCart);
}

export async function updateCartItem(productId: string, quantity: number, cartId?: string) {
  if (!cartId) {
    throw new AppError(400, "CART_REQUIRED", "A cart id is required to update items.");
  }

  const cart = await findCartById(cartId);

  if (!cart) {
    throw new AppError(404, "CART_NOT_FOUND", "Cart not found.");
  }

  const product = await getProductForCart(productId);

  if (quantity <= 0) {
    await deleteCartItem(cart.id, productId);
  } else {
    if (quantity > product.inventoryCount) {
      throw new AppError(400, "INSUFFICIENT_INVENTORY", "Requested quantity exceeds inventory.", {
        available: product.inventoryCount
      });
    }

    await upsertCartItem(cart.id, productId, quantity);
  }

  const freshCart = await findCartById(cart.id);

  if (!freshCart) {
    throw new AppError(500, "CART_NOT_FOUND", "Cart could not be loaded after update.");
  }

  return serializeCart(freshCart);
}

export async function removeCartItem(productId: string, cartId?: string) {
  if (!cartId) {
    throw new AppError(400, "CART_REQUIRED", "A cart id is required to remove items.");
  }

  const cart = await findCartById(cartId);

  if (!cart) {
    throw new AppError(404, "CART_NOT_FOUND", "Cart not found.");
  }

  await deleteCartItem(cart.id, productId);
  const freshCart = await findCartById(cart.id);

  if (!freshCart) {
    throw new AppError(500, "CART_NOT_FOUND", "Cart could not be loaded after update.");
  }

  return serializeCart(freshCart);
}
