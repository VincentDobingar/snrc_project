import slugify from "slugify";
import { PublicationsModel } from "../models/publications.model.js";
import { ok } from "../utils/apiResponse.js";

const makeSlug = (value) => slugify(value || "publication", { lower: true, strict: true, trim: true });

export const PublicationsController = {
  async getPublic(_req, res) {
    const publications = await PublicationsModel.listPublic();
    return ok(res, "Publications récupérées avec succès", { publications });
  },
  async getPublicBySlug(req, res, next) {
    const publication = await PublicationsModel.findBySlug(req.params.slug);
    if (!publication) {
      const error = new Error("Publication introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Publication récupérée avec succès", { publication });
  },
  async getCategories(_req, res) {
    const categories = await PublicationsModel.listCategories();
    return ok(res, "Catégories récupérées avec succès", { categories });
  },
  async getAll(_req, res) {
    const publications = await PublicationsModel.listAll();
    return ok(res, "Publications récupérées avec succès", { publications });
  },
  async create(req, res, next) {
    const file_url = req.body.file_url;
    if (!file_url) {
      const error = new Error("file_url est requis");
      error.status = 422;
      return next(error);
    }
    const isPublished = req.body.status === "published";
    const publication = await PublicationsModel.create({
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : makeSlug(req.body.title),
      published_at: req.body.published_at || (isPublished ? new Date() : null),
      user_id: req.user.id,
    });
    return ok(res, "Publication créée avec succès", { publication }, 201);
  },
  async update(req, res, next) {
    const existing = await PublicationsModel.findById(req.params.id);
    if (!existing) {
      const error = new Error("Publication introuvable");
      error.status = 404;
      return next(error);
    }
    const isPublished = (req.body.status || existing.status) === "published";
    const publication = await PublicationsModel.update(req.params.id, {
      ...existing,
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : req.body.title ? makeSlug(req.body.title) : existing.slug,
      published_at: req.body.published_at ?? existing.published_at ?? (isPublished ? new Date() : null),
      user_id: req.user.id,
    });
    return ok(res, "Publication mise à jour avec succès", { publication });
  },
  async remove(req, res, next) {
    const deleted = await PublicationsModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("Publication introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Publication supprimée avec succès");
  },
};
