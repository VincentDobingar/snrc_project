import { FAQModel } from "../models/faq.model.js";
import { ok } from "../utils/apiResponse.js";
import { parsePagination } from "../utils/pagination.js";

export const FAQController = {
  async getPublic(_req, res) {
    const faqs = await FAQModel.listPublic();
    return ok(res, "FAQ récupérées avec succès", { faqs });
  },
  async getAll(req, res) {
    const { limit, offset } = parsePagination(req.query);
    const { rows: faqs, total } = await FAQModel.listAll({ limit, offset });
    return ok(res, "FAQ récupérées avec succès", { faqs, total, limit, offset });
  },
  async create(req, res) {
    const faq = await FAQModel.create(req.body);
    return ok(res, "FAQ créée avec succès", { faq }, 201);
  },
  async update(req, res, next) {
    const existing = await FAQModel.findById(req.params.id);
    if (!existing) {
      const error = new Error("FAQ introuvable");
      error.status = 404;
      return next(error);
    }
    const faq = await FAQModel.update(req.params.id, { ...existing, ...req.body });
    return ok(res, "FAQ mise à jour avec succès", { faq });
  },
  async remove(req, res, next) {
    const deleted = await FAQModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("FAQ introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "FAQ supprimée avec succès");
  },
};
