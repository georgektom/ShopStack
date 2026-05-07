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

type ApiOptions = RequestInit;

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers
  });

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

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  shippingMethod: string;
  shippingCost: number;
  paymentCardholderName: string;
  paymentCardBrand: string;
  paymentCardLast4: string;
  paymentExpiryMonth: number;
  paymentExpiryYear: number;
  status: string;
  subtotal: number;
  total: number;
  itemCount: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productName: string;
    productImage: string;
    productId: string;
  }>;
};
