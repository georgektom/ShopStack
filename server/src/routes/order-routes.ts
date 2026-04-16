import { Router } from "express";
import { createOrder } from "../controllers/order-controller.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validation/order-schemas.js";

export const orderRouter = Router();

orderRouter.post("/", validate(createOrderSchema), createOrder);
