import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";
import { findCartById } from "../repositories/cart-repository.js";
import { createSession, deleteSessionByToken, findSessionByToken } from "../repositories/session-repository.js";
import { createUser, findUserByEmail } from "../repositories/user-repository.js";
import { AppError } from "../utils/app-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

function serializeUser(user: { id: string; name: string; email: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

async function getOrCreateUserCart(userId: string) {
  const existingCart = await prisma.cart.findFirst({
    where: { userId }
  });

  if (existingCart) {
    return existingCart;
  }

  return prisma.cart.create({
    data: {
      userId
    }
  });
}

async function mergeGuestCartIntoUser(cartId: string | undefined, userId: string) {
  if (!cartId) {
    const userCart = await getOrCreateUserCart(userId);
    return userCart.id;
  }

  const guestCart = await findCartById(cartId);

  if (!guestCart) {
    const userCart = await getOrCreateUserCart(userId);
    return userCart.id;
  }

  if (guestCart.userId === userId) {
    return guestCart.id;
  }

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: true
    }
  });

  if (!userCart) {
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: {
        userId
      }
    });
    return guestCart.id;
  }

  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find((item) => item.productId === guestItem.productId);
    const nextQuantity = (existingItem?.quantity ?? 0) + guestItem.quantity;

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: userCart.id,
          productId: guestItem.productId
        }
      },
      create: {
        cartId: userCart.id,
        productId: guestItem.productId,
        quantity: nextQuantity
      },
      update: {
        quantity: nextQuantity
      }
    });
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: guestCart.id
    }
  });

  await prisma.cart.delete({
    where: {
      id: guestCart.id
    }
  });

  return userCart.id;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  cartId?: string;
}) {
  const email = input.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(409, "EMAIL_IN_USE", "An account with this email already exists.");
  }

  const user = await createUser({
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password)
  });

  const cartId = await mergeGuestCartIntoUser(input.cartId, user.id);

  const session = await createSession({
    token: randomUUID(),
    userId: user.id
  });

  return {
    token: session.token,
    user: serializeUser(session.user),
    cartId
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
  cartId?: string;
}) {
  const user = await findUserByEmail(input.email.trim().toLowerCase());

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  const cartId = await mergeGuestCartIntoUser(input.cartId, user.id);

  const session = await createSession({
    token: randomUUID(),
    userId: user.id
  });

  return {
    token: session.token,
    user: serializeUser(session.user),
    cartId
  };
}

export async function getSessionUser(token?: string) {
  if (!token) {
    return null;
  }

  const session = await findSessionByToken(token);

  if (!session) {
    return null;
  }

  return serializeUser(session.user);
}

export async function logoutUser(token?: string) {
  if (!token) {
    return;
  }

  await deleteSessionByToken(token);
}
