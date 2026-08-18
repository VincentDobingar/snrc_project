import { SettingsModel } from "../models/settings.model.js";
import { ok } from "../utils/apiResponse.js";

export const SettingsController = {
  async get(_req, res) {
    const settings = await SettingsModel.get();
    return ok(res, "Paramètres récupérés avec succès", { settings });
  },
  async update(req, res) {
    const settings = await SettingsModel.update(req.body);
    return ok(res, "Paramètres mis à jour avec succès", { settings });
  },
};
