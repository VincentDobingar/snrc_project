// multer lève ses propres erreurs (fichier trop volumineux, champ inattendu...)
// sous forme de MulterError avec un `.code`, sans `.status` HTTP — sans ce
// mappage, errorHandler les traiterait comme des erreurs serveur génériques
// (500) alors que ce sont des erreurs clients attendues (413/400).
const MULTER_ERROR_STATUS = {
  LIMIT_FILE_SIZE: 413,
  LIMIT_FILE_COUNT: 413,
  LIMIT_UNEXPECTED_FILE: 400,
  LIMIT_PART_COUNT: 400,
  LIMIT_FIELD_KEY: 400,
  LIMIT_FIELD_VALUE: 400,
  LIMIT_FIELD_COUNT: 400,
};

function resolveStatus(error) {
  if (error.status) return error.status;
  if (error.name === "MulterError" && MULTER_ERROR_STATUS[error.code]) {
    return MULTER_ERROR_STATUS[error.code];
  }
  return 500;
}

export function errorHandler(env) {
  return function handleError(error, _req, res, _next) {
    console.error("🔥 Erreur globale API SNRC :", error);

    const isProd = env.NODE_ENV === "production";
    const status = resolveStatus(error);
    res.status(status).json({
      success: false,
      message: isProd && status === 500 ? "Erreur interne du serveur." : error.message || "Erreur interne du serveur.",
      errors: error.errors || [],
    });
  };
}
