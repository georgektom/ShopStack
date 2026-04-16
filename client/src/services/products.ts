import { apiRequest, type Product } from "./api";

type ProductQuery = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export function getProducts(query: ProductQuery = {}) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const qs = searchParams.toString();
  return apiRequest<Product[]>(`/products${qs ? `?${qs}` : ""}`);
}

export function getProduct(id: string) {
  return apiRequest<Product>(`/products/${id}`);
}
