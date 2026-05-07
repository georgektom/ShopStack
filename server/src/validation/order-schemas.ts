import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(2),
    customerEmail: z.string().trim().email(),
    addressLine1: z.string().trim().min(5),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    postalCode: z.string().trim().min(5),
    shippingMethod: z.enum(["standard", "express", "overnight"]),
    paymentCardholderName: z.string().trim().min(2),
    paymentCardNumber: z.string().trim().regex(/^\d{13,19}$/),
    paymentExpiryMonth: z.coerce.number().int().min(1).max(12),
    paymentExpiryYear: z.coerce.number().int().min(2025).max(2100)
  }),
  headers: z.object({}).passthrough().optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
