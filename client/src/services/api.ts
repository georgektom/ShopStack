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

export async function apiRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
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
