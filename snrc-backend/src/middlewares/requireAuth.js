import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthModel } from "../models/auth.model.js";

export async function requireAuth(req, _res, next) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies?.[env.COOKIE_NAME] || bearer;

  if (!token) {
    const error = new Error("Authentification requise");
    error.status = 401;
    return next(error);
  }

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    const error = new Error("Session invalide ou expirée");
    error.status = 401;
    return next(error);
  }

  try {
    const currentTokenVersion = await AuthModel.getTokenVersion(payload.id);
    if (currentTokenVersion === null || currentTokenVersion !== payload.token_version) {
      const error = new Error("Session invalide ou expirée");
      error.status = 401;
      return next(error);
    }
    req.user = payload;
    return next();
  } catch (dbError) {
    return next(dbError);
  }
}
