import { Router } from "express";
import {
  createCartItem,
  destroyCartItem,
  fetchCart,
  patchCartItem
} from "../controllers/cart-controller.js";
import { validate } from "../middleware/validate.js";
import {
  addCartItemSchema,
  removeCartItemSchema,
  updateCartItemSchema
} from "../validation/cart-schemas.js";

export const cartRouter = Router();

cartRouter.get("/", fetchCart);
cartRouter.post("/items", validate(addCartItemSchema), createCartItem);
cartRouter.patch("/items/:productId", validate(updateCartItemSchema), patchCartItem);
cartRouter.delete("/items/:productId", validate(removeCartItemSchema), destroyCartItem);
