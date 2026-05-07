import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(8)
  }),
  headers: z.object({}).passthrough().optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(8)
  }),
  headers: z.object({}).passthrough().optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
