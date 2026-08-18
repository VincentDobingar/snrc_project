import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { loginValidator } from "../validators/auth.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { loginLimiter } from "../middlewares/rateLimiters.js";

const router = Router();
router.post("/auth/login", loginLimiter, loginValidator, validateRequest, asyncHandler(AuthController.login));
router.post("/auth/logout", asyncHandler(AuthController.logout));
router.get("/auth/me", requireAuth, asyncHandler(AuthController.me));
router.post("/auth/refresh", requireAuth, asyncHandler(AuthController.refresh));
export default router;
