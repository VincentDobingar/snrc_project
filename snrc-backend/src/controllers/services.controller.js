import slugify from "slugify";
import { ServicesModel } from "../models/services.model.js";
import { ok } from "../utils/apiResponse.js";

const makeSlug = (value) => slugify(value || "service", { lower: true, strict: true, trim: true });

export const ServicesController = {
  async getPublic(_req, res) {
    const services = await ServicesModel.listPublic();
    return ok(res, "Services récupérés avec succès", { services });
  },
  async getAll(_req, res) {
    const services = await ServicesModel.listAll();
    return ok(res, "Services récupérés avec succès", { services });
  },
  async create(req, res) {
    const service = await ServicesModel.create({
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : makeSlug(req.body.title),
    });
    return ok(res, "Service créé avec succès", { service }, 201);
  },
  async update(req, res, next) {
    const existing = await ServicesModel.findById(req.params.id);
    if (!existing) {
      const error = new Error("Service introuvable");
      error.status = 404;
      return next(error);
    }
    const service = await ServicesModel.update(req.params.id, {
      ...existing,
      ...req.body,
      slug: req.body.slug ? makeSlug(req.body.slug) : req.body.title ? makeSlug(req.body.title) : existing.slug,
    });
    return ok(res, "Service mis à jour avec succès", { service });
  },
  async remove(req, res, next) {
    const deleted = await ServicesModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("Service introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Service supprimé avec succès");
  },
};
