import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { updateSettingsValidator } from "../validators/settings.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
const router = Router();
router.get("/settings", asyncHandler(SettingsController.get));
router.put(
  "/admin/settings",
  requireAuth,
  requireRole("superadmin", "admin_editeur"),
  updateSettingsValidator,
  validateRequest,
  asyncHandler(SettingsController.update)
);
export default router;