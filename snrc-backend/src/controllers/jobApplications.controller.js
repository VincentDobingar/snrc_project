import { JobOffersModel } from "../models/jobs.model.js";
import { JobApplicationsModel } from "../models/jobApplications.model.js";
import { ok } from "../utils/apiResponse.js";
import { DOCUMENT_MIME_TYPES } from "../middlewares/upload.js";
import { verifyUploadedFilesContent } from "../middlewares/verifyFileContent.js";
import { parsePagination } from "../utils/pagination.js";

export const JobApplicationsController = {
  async apply(req, res, next) {
    const job = await JobOffersModel.findById(req.params.id);
    if (!job || job.status !== "published") {
      const error = new Error("Offre d'emploi introuvable ou fermée");
      error.status = 404;
      return next(error);
    }

    const cvFile = req.files?.cv?.[0];
    if (!cvFile) {
      const error = new Error("Le CV est requis");
      error.status = 422;
      return next(error);
    }
    const coverLetterFile = req.files?.cover_letter_file?.[0];

    const isValid = await verifyUploadedFilesContent([cvFile, coverLetterFile], DOCUMENT_MIME_TYPES);
    if (!isValid) {
      const error = new Error("Le contenu d'un des fichiers envoyés ne correspond pas à un type de document autorisé");
      error.status = 400;
      return next(error);
    }

    const application = await JobApplicationsModel.create({
      job_offer_id: job.id,
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone,
      education_level: req.body.education_level,
      cover_letter_text: req.body.cover_letter_text,
      cv_file: `/uploads/documents/${cvFile.filename}`,
      cover_letter_file: coverLetterFile ? `/uploads/documents/${coverLetterFile.filename}` : null,
    });

    return ok(res, "Candidature envoyée avec succès", { application }, 201);
  },
  async getAll(req, res) {
    const { limit, offset } = parsePagination(req.query);
    const { rows: applications, total } = await JobApplicationsModel.listAll({ limit, offset });
    return ok(res, "Candidatures récupérées avec succès", { applications, total, limit, offset });
  },
  async getById(req, res, next) {
    const application = await JobApplicationsModel.findById(req.params.id);
    if (!application) {
      const error = new Error("Candidature introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Candidature récupérée avec succès", { application });
  },
  async markAsRead(req, res, next) {
    const application = await JobApplicationsModel.markAsRead(req.params.id, true);
    if (!application) {
      const error = new Error("Candidature introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Candidature marquée comme lue", { application });
  },
  async remove(req, res, next) {
    const deleted = await JobApplicationsModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("Candidature introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Candidature supprimée avec succès");
  },
};
