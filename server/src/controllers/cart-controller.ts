import type { Request, Response } from "express";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/cart-service.js";

function getCartId(request: Request) {
  return request.header("X-Cart-Id") ?? undefined;
}

export async function fetchCart(request: Request, response: Response) {
  console.log("GET /api/cart", {
    cartId: getCartId(request)
  });

  const cart = await getCart(getCartId(request));
  response.setHeader("X-Cart-Id", cart.id);
  return response.json({ data: cart });
}

export async function createCartItem(request: Request, response: Response) {
  console.log("POST /api/cart/items", {
    cartId: getCartId(request),
    body: request.body
  });

  const cart = await addCartItem(request.body.productId, Number(request.body.quantity), getCartId(request));
  response.setHeader("X-Cart-Id", cart.id);
  return response.status(201).json({ data: cart });
}

export async function patchCartItem(request: Request, response: Response) {
  console.log("PATCH /api/cart/items/:productId", {
    cartId: getCartId(request),
    productId: request.params.productId,
    body: request.body
  });

  const cart = await updateCartItem(
    request.params.productId,
    Number(request.body.quantity),
    getCartId(request)
  );
  response.setHeader("X-Cart-Id", cart.id);
  return response.json({ data: cart });
}

export async function destroyCartItem(request: Request, response: Response) {
  console.log("DELETE /api/cart/items/:productId", {
    cartId: getCartId(request),
    productId: request.params.productId
  });

  const cart = await removeCartItem(request.params.productId, getCartId(request));
  response.setHeader("X-Cart-Id", cart.id);
  return response.json({ data: cart });
}
