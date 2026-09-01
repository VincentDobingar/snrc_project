import slugify from "slugify";
import { NewsModel } from "../models/news.model.js";
import { ok } from "../utils/apiResponse.js";
import { parsePagination } from "../utils/pagination.js";

const makeSlug = (value) => slugify(value || "actualite", { lower: true, strict: true, trim: true });

export const NewsController = {
  async getPublic(req, res) {
    const rawLimit = Number(req.query.limit);
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 20;
    const news = await NewsModel.listPublic(limit);
    return ok(res, "Actualités récupérées avec succès", { news });
  },
  async getPublicBySlug(req, res, next) {
    const item = await NewsModel.findBySlug(req.params.slug);
    if (!item) {
      const error = new Error("Actualité introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Actualité récupérée avec succès", { news: item });
  },
  async getAll(req, res) {
    const { limit, offset } = parsePagination(req.query);
    const { rows: news, total } = await NewsModel.listAll({ limit, offset });
    return ok(res, "Actualités récupérées avec succès", { news, total, limit, offset });
  },
  async create(req, res) {
    const isPublished = req.body.status === "published";
    const news = await NewsModel.create({
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : makeSlug(req.body.title),
      published_at: req.body.published_at || (isPublished ? new Date() : null),
      user_id: req.user.id,
    });
    return ok(res, "Actualité créée avec succès", { news }, 201);
  },
  async update(req, res, next) {
    const existing = await NewsModel.findById(req.params.id);
    if (!existing) {
      const error = new Error("Actualité introuvable");
      error.status = 404;
      return next(error);
    }
    const isPublished = (req.body.status || existing.status) === "published";
    const news = await NewsModel.update(req.params.id, {
      ...existing,
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : req.body.title ? makeSlug(req.body.title) : existing.slug,
      published_at: req.body.published_at ?? existing.published_at ?? (isPublished ? new Date() : null),
      user_id: req.user.id,
    });
    return ok(res, "Actualité mise à jour avec succès", { news });
  },
  async remove(req, res, next) {
    const deleted = await NewsModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("Actualité introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Actualité supprimée avec succès");
  },
};
