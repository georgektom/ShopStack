import { z } from "zod";

const cartHeaders = z.object({
  "x-cart-id": z.string().optional()
});

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).max(10)
  }),
  headers: cartHeaders.passthrough(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.coerce.number().int().min(0).max(10)
  }),
  params: z.object({
    productId: z.string().min(1)
  }),
  headers: cartHeaders.passthrough(),
  query: z.object({}).optional()
});

export const removeCartItemSchema = z.object({
  params: z.object({
    productId: z.string().min(1)
  }),
  headers: cartHeaders.passthrough(),
  body: z.object({}).optional(),
  query: z.object({}).optional()
});
