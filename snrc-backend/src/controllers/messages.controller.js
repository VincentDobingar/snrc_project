import { MessagesModel } from "../models/messages.model.js";
import { ok } from "../utils/apiResponse.js";

export const MessagesController = {
  async contact(req, res) {
    const message = await MessagesModel.create(req.body);
    return ok(res, "Message envoyé avec succès", { message }, 201);
  },
  async getAll(_req, res) {
    const messages = await MessagesModel.listAll();
    return ok(res, "Messages récupérés avec succès", { messages });
  },
  async getById(req, res, next) {
    const message = await MessagesModel.findById(req.params.id);
    if (!message) {
      const error = new Error("Message introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Message récupéré avec succès", { message });
  },
  async markAsRead(req, res, next) {
    const message = await MessagesModel.markAsRead(req.params.id, true);
    if (!message) {
      const error = new Error("Message introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Message marqué comme lu", { message });
  },
  async remove(req, res, next) {
    const deleted = await MessagesModel.remove(req.params.id);
    if (!deleted) {
      const error = new Error("Message introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Message supprimé avec succès");
  },
};
