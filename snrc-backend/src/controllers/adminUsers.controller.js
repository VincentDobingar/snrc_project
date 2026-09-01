import bcrypt from "bcryptjs";
import { AdminUsersModel } from "../models/adminUsers.model.js";
import { AuthModel } from "../models/auth.model.js";
import { ok } from "../utils/apiResponse.js";
import { parsePagination } from "../utils/pagination.js";

export const AdminUsersController = {
  async getAll(req, res) {
    const { limit, offset } = parsePagination(req.query);
    const { rows: users, total } = await AdminUsersModel.listAll({ limit, offset });
    return ok(res, "Administrateurs récupérés avec succès", { users, total, limit, offset });
  },
  async create(req, res, next) {
    const existing = await AuthModel.findByEmail(req.body.email);
    if (existing) {
      const error = new Error("Cet email existe déjà");
      error.status = 409;
      return next(error);
    }
    const user = await AdminUsersModel.create({
      ...req.body,
      password_hash: await bcrypt.hash(req.body.password, 10),
    });
    return ok(res, "Administrateur créé avec succès", { user }, 201);
  },
  async update(req, res, next) {
    const existing = await AdminUsersModel.findRawById(req.params.id);
    if (!existing) {
      const error = new Error("Administrateur introuvable");
      error.status = 404;
      return next(error);
    }
    if (req.body.email && req.body.email !== existing.email) {
      const duplicate = await AuthModel.findByEmail(req.body.email);
      if (duplicate) {
        const error = new Error("Cet email existe déjà");
        error.status = 409;
        return next(error);
      }
    }
    const newRole = req.body.role ?? existing.role;
    const newStatus = req.body.status ?? existing.status;
    // Garde-fou "dernier superadmin actif" : ne s'applique que lorsque la cible
    // est elle-même superadmin et qu'on la désactive/rétrograde. La vérification
    // et l'UPDATE s'exécutent dans une seule transaction (updateWithGuard) pour
    // éviter la race condition où deux requêtes concurrentes désactivant deux
    // superadmins différents pouvaient chacune lire "il en reste un autre".
    const lastSuperadminGuardApplies =
      existing.role === "superadmin" && (newStatus === "inactive" || newRole !== "superadmin");
    // Révocation des sessions déjà émises (bump token_version) : toute
    // désactivation, quel que soit le rôle, ainsi que la rétrogradation d'un
    // superadmin, doivent invalider immédiatement les JWT déjà en circulation
    // (requireAuth ne vérifie pas admins.status, seulement token_version).
    const revokesSecurity = newStatus === "inactive" || (existing.role === "superadmin" && newRole !== "superadmin");

    let user;
    try {
      user = await AdminUsersModel.updateWithGuard(
        req.params.id,
        {
          full_name: req.body.full_name ?? existing.full_name,
          email: req.body.email ?? existing.email,
          role: newRole,
          status: newStatus,
        },
        { guardLastSuperadmin: lastSuperadminGuardApplies }
      );
    } catch (error) {
      return next(error);
    }
    if (revokesSecurity) {
      await AdminUsersModel.bumpTokenVersion(req.params.id);
    }
    return ok(res, "Administrateur mis à jour avec succès", { user });
  },
  async updatePassword(req, res, next) {
    const existing = await AdminUsersModel.findRawById(req.params.id);
    if (!existing) {
      const error = new Error("Administrateur introuvable");
      error.status = 404;
      return next(error);
    }
    await AdminUsersModel.updatePassword(req.params.id, await bcrypt.hash(req.body.password, 10));
    await AdminUsersModel.bumpTokenVersion(req.params.id);
    return ok(res, "Mot de passe mis à jour avec succès");
  },
  async remove(req, res, next) {
    const existing = await AdminUsersModel.findRawById(req.params.id);
    if (!existing) {
      const error = new Error("Administrateur introuvable");
      error.status = 404;
      return next(error);
    }
    let deleted;
    try {
      deleted = await AdminUsersModel.removeWithGuard(req.params.id, {
        guardLastSuperadmin: existing.role === "superadmin",
      });
    } catch (error) {
      return next(error);
    }
    if (!deleted) {
      const error = new Error("Administrateur introuvable");
      error.status = 404;
      return next(error);
    }
    return ok(res, "Administrateur supprimé avec succès");
  },
};
