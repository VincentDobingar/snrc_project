import slugify from "slugify";
import { PagesModel } from "../models/pages.model.js";
import { ok } from "../utils/apiResponse.js";

const makeSlug = (value) => slugify(value || "page", { lower: true, strict: true, trim: true });

export const PagesController = {
  async getPublicBySlug(req, res, next) {
    const page = await PagesModel.findPublicBySlug(req.params.slug);
    if (!page) {
      const error = new Error("Page introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Page récupérée avec succès", { page });
  },
  async getAll(_req, res) {
    const pages = await PagesModel.listAll();
    return ok(res, "Pages récupérées avec succès", { pages });
  },
  async create(req, res) {
    const page = await PagesModel.create({
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : makeSlug(req.body.title),
      user_id: req.user.id,
    });
    return ok(res, "Page créée avec succès", { page }, 201);
  },
  async update(req, res, next) {
    const existing = await PagesModel.findById(req.params.id);
    if (!existing) {
      const error = new Error("Page introuvable");
      error.status = 404;
      return next(error);
    }
    const page = await PagesModel.update(req.params.id, {
      ...existing,
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : req.body.title ? makeSlug(req.body.title) : existing.slug,
      user_id: req.user.id,
    });
    return ok(res, "Page mise à jour avec succès", { page });
  },
  async remove(req, res, next) {
    const deleted = await PagesModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("Page introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Page supprimée avec succès");
  },
};
