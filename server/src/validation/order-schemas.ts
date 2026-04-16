import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(2),
    customerEmail: z.string().trim().email(),
    addressLine1: z.string().trim().min(5),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    postalCode: z.string().trim().min(5)
  }),
  headers: z
    .object({
      "x-cart-id": z.string().min(1)
    })
    .passthrough(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
