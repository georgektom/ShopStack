import type { Request, Response } from "express";
import { loginUser, logoutUser, registerUser, getSessionUser } from "../services/auth-service.js";
import { getAuthTokenFromCookie, setAuthCookie, clearAuthCookie } from "../utils/auth-cookie.js";
import { clearCartCookie, getCartIdFromCookie, setCartCookie } from "../utils/cart-cookie.js";

export async function register(request: Request, response: Response) {
  const result = await registerUser({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    cartId: getCartIdFromCookie(request)
  });

  setAuthCookie(response, result.token);
  if (result.cartId) {
    setCartCookie(response, result.cartId);
  }
  return response.status(201).json({ data: result.user });
}

export async function login(request: Request, response: Response) {
  const result = await loginUser({
    email: request.body.email,
    password: request.body.password,
    cartId: getCartIdFromCookie(request)
  });

  setAuthCookie(response, result.token);
  if (result.cartId) {
    setCartCookie(response, result.cartId);
  }
  return response.json({ data: result.user });
}

export async function me(request: Request, response: Response) {
  const user = await getSessionUser(getAuthTokenFromCookie(request));
  return response.json({ data: user });
}

export async function logout(request: Request, response: Response) {
  await logoutUser(getAuthTokenFromCookie(request));
  clearAuthCookie(response);
  clearCartCookie(response);
  return response.status(204).send();
}
