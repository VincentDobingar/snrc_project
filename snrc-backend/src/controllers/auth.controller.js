import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { AuthModel } from "../models/auth.model.js";
import { ok } from "../utils/apiResponse.js";
import { buildAuthCookieOptions } from "../utils/cookies.js";
import { issueCsrfToken, clearCsrfToken } from "../utils/csrf.js";

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

export const AuthController = {
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await AuthModel.findByEmail(email);

    if (!user) {
      const error = new Error("Identifiants invalides");
      error.status = 401;
      return next(error);
    }
    if (user.status !== "active") {
      const error = new Error("Compte inactif");
      error.status = 403;
      return next(error);
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      const error = new Error("Identifiants invalides");
      error.status = 401;
      return next(error);
    }

    await AuthModel.touchLastLogin(user.id);
    const token = signToken(user);
    res.cookie(env.COOKIE_NAME, token, buildAuthCookieOptions());
    issueCsrfToken(res);

    return ok(res, "Connexion réussie", {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  },

  async me(req, res, next) {
    const user = await AuthModel.findById(req.user.id);
    if (!user) {
      const error = new Error("Utilisateur introuvable");
      error.status = 404;
      return next(error);
    }
    if (user.status !== "active") {
      const error = new Error("Compte inactif");
      error.status = 403;
      return next(error);
    }
    issueCsrfToken(res);
    return ok(res, "Profil récupéré avec succès", { user });
  },

  async refresh(req, res, next) {
    const user = await AuthModel.findById(req.user.id);
    if (!user) {
      const error = new Error("Utilisateur introuvable");
      error.status = 404;
      return next(error);
    }
    if (user.status !== "active") {
      const error = new Error("Compte inactif");
      error.status = 403;
      return next(error);
    }
    const token = signToken(user);
    res.cookie(env.COOKIE_NAME, token, buildAuthCookieOptions());
    issueCsrfToken(res);
    return ok(res, "Session renouvelée", { user });
  },

  async logout(_req, res) {
    res.clearCookie(env.COOKIE_NAME, { ...buildAuthCookieOptions(), maxAge: 0 });
    clearCsrfToken(res);
    return ok(res, "Déconnexion réussie");
  },
};
