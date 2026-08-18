import { Router } from "express";
import authRoutes from "./auth.routes.js";
import pagesRoutes from "./pages.routes.js";
import servicesRoutes from "./services.routes.js";
import newsRoutes from "./news.routes.js";
import publicationsRoutes from "./publications.routes.js";
import faqRoutes from "./faq.routes.js";
import messagesRoutes from "./messages.routes.js";
import settingsRoutes from "./settings.routes.js";
import adminUsersRoutes from "./adminUsers.routes.js";
import uploadRoutes from "./upload.routes.js";
import jobsRoutes from "./jobs.routes.js";

const router = Router();

router.use(authRoutes);
router.use(pagesRoutes);
router.use(servicesRoutes);
router.use(newsRoutes);
router.use(publicationsRoutes);
router.use(faqRoutes);
router.use(messagesRoutes);
router.use(settingsRoutes);
router.use(adminUsersRoutes);
router.use(uploadRoutes);
router.use(jobsRoutes);

export default router;
