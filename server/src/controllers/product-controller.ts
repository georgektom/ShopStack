import type { Request, Response } from "express";
import { getProductById, listProducts } from "../services/product-service.js";

export async function getProducts(request: Request, response: Response) {
  const products = await listProducts({
    search: request.query.search as string | undefined,
    category: request.query.category as string | undefined,
    minPrice: request.query.minPrice ? Number(request.query.minPrice) : undefined,
    maxPrice: request.query.maxPrice ? Number(request.query.maxPrice) : undefined,
    sort: request.query.sort as "price_asc" | "price_desc" | "name_asc" | "newest" | undefined
  });

  return response.json({ data: products });
}

export async function getProduct(request: Request, response: Response) {
  const product = await getProductById(request.params.id);
  return response.json({ data: product });
}
