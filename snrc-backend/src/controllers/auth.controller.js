import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { AuthModel } from "../models/auth.model.js";
import { ok } from "../utils/apiResponse.js";
import { buildAuthCookieOptions } from "../utils/cookies.js";
import { issueCsrfToken, clearCsrfToken } from "../utils/csrf.js";
import { isAccountLocked, recordFailedLogin, clearFailedLogins } from "../utils/accountLockout.js";

// Hash factice comparé à mot de passe constant : consomme un temps de calcul
// bcrypt similaire au chemin "email connu" pour empêcher un attaquant de
// déduire, par la durée de réponse, si un email correspond à un compte admin.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-constant-time-compare", 10);

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      token_version: user.token_version,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

export const AuthController = {
  async login(req, res, next) {
    const { email, password } = req.body;

    if (isAccountLocked(email)) {
      const error = new Error("Trop de tentatives échouées pour ce compte. Réessayez dans quelques minutes.");
      error.status = 429;
      return next(error);
    }

    const user = await AuthModel.findByEmail(email);

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      recordFailedLogin(email);
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
      recordFailedLogin(email);
      const error = new Error("Identifiants invalides");
      error.status = 401;
      return next(error);
    }

    clearFailedLogins(email);
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
