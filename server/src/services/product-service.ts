import { AppError } from "../utils/app-error.js";
import { findProductById, findProducts } from "../repositories/product-repository.js";

type ProductFilters = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "newest";
};

export async function listProducts(filters: ProductFilters) {
  const orderBy =
    filters.sort === "price_asc"
      ? { price: "asc" as const }
      : filters.sort === "price_desc"
        ? { price: "desc" as const }
        : filters.sort === "name_asc"
          ? { name: "asc" as const }
          : { createdAt: "desc" as const };

  const products = await findProducts({
    where: {
      AND: [
        filters.search
          ? {
              OR: [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } }
              ]
            }
          : {},
        filters.category
          ? {
              category: {
                slug: filters.category
              }
            }
          : {},
        typeof filters.minPrice === "number"
          ? {
              price: {
                gte: filters.minPrice
              }
            }
          : {},
        typeof filters.maxPrice === "number"
          ? {
              price: {
                lte: filters.maxPrice
              }
            }
          : {}
      ]
    },
    include: {
      category: true
    },
    orderBy
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.image,
    inventoryCount: product.inventoryCount,
    category: product.category.name,
    categorySlug: product.category.slug
  }));
}

export async function getProductById(id: string) {
  const product = await findProductById(id);

  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.image,
    inventoryCount: product.inventoryCount,
    category: product.category.name,
    categorySlug: product.category.slug
  };
}
