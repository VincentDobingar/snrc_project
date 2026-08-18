import { Router } from "express";
import { JobsController } from "../controllers/jobs.controller.js";
import { JobApplicationsController } from "../controllers/jobApplications.controller.js";
import { jobOfferValidator } from "../validators/jobs.validator.js";
import { jobApplicationValidator } from "../validators/jobApplication.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { documentUpload } from "../middlewares/upload.js";
import { sanitizeHtmlFields } from "../middlewares/sanitizeHtmlFields.js";

const router = Router();

const applicationUpload = documentUpload("documents").fields([
  { name: "cv", maxCount: 1 },
  { name: "cover_letter_file", maxCount: 1 },
]);

// Public
router.get("/jobs", asyncHandler(JobsController.getPublic));
router.get("/jobs/:slug", asyncHandler(JobsController.getPublicBySlug));
router.post(
  "/jobs/:id/apply",
  applicationUpload,
  jobApplicationValidator,
  validateRequest,
  asyncHandler(JobApplicationsController.apply)
);

// Admin - offres
router.get("/admin/jobs", requireAuth, requireRole("superadmin", "admin_editeur"), asyncHandler(JobsController.getAll));
router.post("/admin/jobs", requireAuth, requireRole("superadmin", "admin_editeur"), sanitizeHtmlFields("description", "requirements"), jobOfferValidator, validateRequest, asyncHandler(JobsController.create));
router.put("/admin/jobs/:id", requireAuth, requireRole("superadmin", "admin_editeur"), sanitizeHtmlFields("description", "requirements"), jobOfferValidator, validateRequest, asyncHandler(JobsController.update));
router.delete("/admin/jobs/:id", requireAuth, requireRole("superadmin", "admin_editeur"), asyncHandler(JobsController.remove));

// Admin - candidatures
router.get("/admin/job-applications", requireAuth, requireRole("superadmin", "admin_editeur"), asyncHandler(JobApplicationsController.getAll));
router.get("/admin/job-applications/:id", requireAuth, requireRole("superadmin", "admin_editeur"), asyncHandler(JobApplicationsController.getById));
router.patch("/admin/job-applications/:id/read", requireAuth, requireRole("superadmin", "admin_editeur"), asyncHandler(JobApplicationsController.markAsRead));
router.delete("/admin/job-applications/:id", requireAuth, requireRole("superadmin", "admin_editeur"), asyncHandler(JobApplicationsController.remove));

export default router;
