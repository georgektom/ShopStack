import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth-controller.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validation/auth-schemas.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/me", me);
