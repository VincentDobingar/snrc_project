import slugify from "slugify";
import { JobOffersModel } from "../models/jobs.model.js";
import { ok } from "../utils/apiResponse.js";

const makeSlug = (value) => slugify(value || "offre-emploi", { lower: true, strict: true, trim: true });

export const JobsController = {
  async getPublic(_req, res) {
    const jobs = await JobOffersModel.listPublic();
    return ok(res, "Offres d'emploi récupérées avec succès", { jobs });
  },
  async getPublicBySlug(req, res, next) {
    const job = await JobOffersModel.findBySlug(req.params.slug);
    if (!job) {
      const error = new Error("Offre d'emploi introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Offre d'emploi récupérée avec succès", { job });
  },
  async getAll(_req, res) {
    const jobs = await JobOffersModel.listAll();
    return ok(res, "Offres d'emploi récupérées avec succès", { jobs });
  },
  async create(req, res) {
    const isPublished = req.body.status === "published";
    const job = await JobOffersModel.create({
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : makeSlug(req.body.title),
      published_at: req.body.published_at || (isPublished ? new Date() : null),
      user_id: req.user.id,
    });
    return ok(res, "Offre d'emploi créée avec succès", { job }, 201);
  },
  async update(req, res, next) {
    const existing = await JobOffersModel.findById(req.params.id);
    if (!existing) {
      const error = new Error("Offre d'emploi introuvable");
      error.status = 404;
      return next(error);
    }
    const isPublished = (req.body.status || existing.status) === "published";
    const job = await JobOffersModel.update(req.params.id, {
      ...existing,
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : req.body.title ? makeSlug(req.body.title) : existing.slug,
      published_at: req.body.published_at ?? existing.published_at ?? (isPublished ? new Date() : null),
      user_id: req.user.id,
    });
    return ok(res, "Offre d'emploi mise à jour avec succès", { job });
  },
  async remove(req, res, next) {
    const deleted = await JobOffersModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("Offre d'emploi introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Offre d'emploi supprimée avec succès");
  },
};
