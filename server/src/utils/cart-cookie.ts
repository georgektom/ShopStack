import type { Response, Request } from "express";

const CART_COOKIE_NAME = "shopstack_cart_id";

function parseCookieHeader(cookieHeader?: string) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");

    if (!rawKey) {
      return cookies;
    }

    cookies[rawKey] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

export function getCartIdFromCookie(request: Request) {
  const cookies = parseCookieHeader(request.headers.cookie);
  return cookies[CART_COOKIE_NAME];
}

export function setCartCookie(response: Response, cartId: string) {
  response.cookie(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
}
