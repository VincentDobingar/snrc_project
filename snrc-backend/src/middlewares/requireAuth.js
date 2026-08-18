import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, _res, next) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies?.[env.COOKIE_NAME] || bearer;

  if (!token) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    return next();
  } catch {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    return next(error);
  }
}
