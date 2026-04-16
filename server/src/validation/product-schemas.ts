import { z } from "zod";

export const productQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    sort: z.enum(["price_asc", "price_desc", "name_asc", "newest"]).optional()
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
  headers: z.object({}).passthrough().optional()
});

export const productParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
  headers: z.object({}).passthrough().optional()
});
