import type { Request, Response } from "express";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/cart-service.js";
import { getCartIdFromCookie, setCartCookie } from "../utils/cart-cookie.js";

function getCartId(request: Request) {
  return getCartIdFromCookie(request);
}

export async function fetchCart(request: Request, response: Response) {
  const cart = await getCart(getCartId(request));
  setCartCookie(response, cart.id);
  return response.json({ data: cart });
}

export async function createCartItem(request: Request, response: Response) {
  const cart = await addCartItem(request.body.productId, Number(request.body.quantity), getCartId(request));
  setCartCookie(response, cart.id);
  return response.status(201).json({ data: cart });
}

export async function patchCartItem(request: Request, response: Response) {
  const cart = await updateCartItem(
    request.params.productId,
    Number(request.body.quantity),
    getCartId(request)
  );
  setCartCookie(response, cart.id);
  return response.json({ data: cart });
}

export async function destroyCartItem(request: Request, response: Response) {
  const cart = await removeCartItem(request.params.productId, getCartId(request));
  setCartCookie(response, cart.id);
  return response.json({ data: cart });
}
