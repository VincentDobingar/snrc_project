import { FAQModel } from "../models/faq.model.js";
import { ok } from "../utils/apiResponse.js";

export const FAQController = {
  async getPublic(_req, res) {
    const faqs = await FAQModel.listPublic();
    return ok(res, "FAQ récupérées avec succès", { faqs });
  },
  async getAll(_req, res) {
    const faqs = await FAQModel.listAll();
    return ok(res, "FAQ récupérées avec succès", { faqs });
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
