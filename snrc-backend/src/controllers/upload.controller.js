import { ok } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

function buildPublicUrl(relativePath) {
  const baseUrl = (env.API_URL || "").replace(/\/+$/, "");
  return `${baseUrl}${relativePath}`;
}

export const UploadController = {
  async uploadImage(req, res, next) {
    if (!req.file) {
      const error = new Error("Aucun fichier image reçu");
      error.status = 400;
      return next(error);
    }

    const relativePath = `/uploads/images/${req.file.filename}`;
    const url = buildPublicUrl(relativePath);

    return ok(res, "Image uploadée avec succès", {
      file: {
        original_name: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: relativePath,
        url,
      },
      path: relativePath,
      url,
    });
  },

  async uploadDocument(req, res, next) {
    if (!req.file) {
      const error = new Error("Aucun document reçu");
      error.status = 400;
      return next(error);
    }

    const relativePath = `/uploads/documents/${req.file.filename}`;
    const url = buildPublicUrl(relativePath);

    return ok(res, "Document uploadé avec succès", {
      file: {
        original_name: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: relativePath,
        url,
      },
      path: relativePath,
      url,
    });
  },
};