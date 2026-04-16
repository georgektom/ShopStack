import { getCartId, setCartId } from "../lib/cart-session";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  code: string;
  details: unknown;

  constructor(message: string, code = "API_ERROR", details: unknown = null) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

type ApiOptions = RequestInit & {
  skipCartHeader?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (!options.skipCartHeader) {
    const cartId = getCartId();

    if (cartId) {
      headers.set("X-Cart-Id", cartId);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
  const nextCartId = response.headers.get("X-Cart-Id");

  if (nextCartId) {
    setCartId(nextCartId);
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new ApiError(payload.error?.message ?? "Request failed.", payload.error?.code, payload.error?.details);
  }

  return payload.data as T;
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  inventoryCount: number;
  category: string;
  categorySlug: string;
};

export type CartLineItem = {
  id: string;
  productId: string;
  quantity: number;
  lineTotal: number;
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    inventoryCount: number;
    category: string;
  };
};

export type Cart = {
  id: string;
  itemCount: number;
  subtotal: number;
  total: number;
  items: CartLineItem[];
};
