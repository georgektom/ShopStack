import { Router } from "express";
import { getProduct, getProducts } from "../controllers/product-controller.js";
import { validate } from "../middleware/validate.js";
import { productParamsSchema, productQuerySchema } from "../validation/product-schemas.js";

export const productRouter = Router();

productRouter.get("/", validate(productQuerySchema), getProducts);
productRouter.get("/:id", validate(productParamsSchema), getProduct);
