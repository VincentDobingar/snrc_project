import dotenv from "dotenv";
dotenv.config();

const INSECURE_DEFAULTS = new Set(["change_me", "replace_with_a_long_random_secret", "postgres", ""]);

function required(name, fallback = "") {
  return process.env[name] || fallback;
}

function requireSecret(name) {
  const value = process.env[name];
  if (!value || INSECURE_DEFAULTS.has(value)) {
    throw new Error(
      `Variable d'environnement ${name} manquante ou non sécurisée. ` +
        `Définis une valeur forte et unique dans .env avant de démarrer le serveur.`
    );
  }
  return value;
}

export const env = {
  PORT: Number(required("PORT", 5000)),
  NODE_ENV: required("NODE_ENV", "development"),
  APP_URL: required("APP_URL", "http://localhost:5173"),
  ALLOWED_ORIGINS: required("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  DB_HOST: required("DB_HOST", "localhost"),
  DB_PORT: Number(required("DB_PORT", 5432)),
  DB_NAME: required("DB_NAME", "snrc_db"),
  DB_USER: required("DB_USER", "postgres"),
  DB_PASSWORD: requireSecret("DB_PASSWORD"),
  JWT_SECRET: requireSecret("JWT_SECRET"),
  JWT_EXPIRES_IN: required("JWT_EXPIRES_IN", "1d"),
  COOKIE_NAME: required("COOKIE_NAME", "snrc_token"),
  // Domaine partagé (ex: ".snrc.td") pour que le cookie CSRF, non httpOnly, reste
  // lisible en JS depuis le frontend même s'il est servi sur un sous-domaine
  // différent de l'API (ex: www.snrc.td vs api.snrc.td). Vide en local.
  COOKIE_DOMAIN: required("COOKIE_DOMAIN", ""),
  UPLOAD_DIR: required("UPLOAD_DIR", "uploads"),
  MAX_FILE_SIZE: Number(required("MAX_FILE_SIZE", 5242880)),
};
