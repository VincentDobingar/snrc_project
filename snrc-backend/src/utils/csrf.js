import crypto from "crypto";
import { env } from "../config/env.js";

export const CSRF_COOKIE_NAME = "snrc_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

function buildCsrfCookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function issueCsrfToken(res) {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie(CSRF_COOKIE_NAME, token, buildCsrfCookieOptions());
  return token;
}

export function clearCsrfToken(res) {
  res.clearCookie(CSRF_COOKIE_NAME, { ...buildCsrfCookieOptions(), maxAge: 0 });
}

// Défense CSRF (double-submit cookie) : uniquement pertinente quand la requête
// est authentifiée par cookie (sameSite:"none" en prod, donc envoyé automatiquement
// par le navigateur même depuis un site tiers). Un Authorization: Bearer n'est
// jamais envoyé automatiquement par le navigateur : pas de risque CSRF pour ce cas.
export function csrfProtection(req, _res, next) {
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  const usesCookieAuth = Boolean(req.cookies?.[env.COOKIE_NAME]) && !req.headers.authorization;

  if (!isMutating || !usesCookieAuth) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    const error = new Error("Jeton CSRF invalide ou manquant");
    error.status = 403;
    return next(error);
  }

  return next();
}
