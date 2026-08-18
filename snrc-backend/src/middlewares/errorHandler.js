export function errorHandler(env) {
  return function handleError(error, _req, res, _next) {
    console.error("🔥 Erreur globale API SNRC :", error);

    const isProd = env.NODE_ENV === "production";
    res.status(error.status || 500).json({
      success: false,
      message: isProd && !error.status ? "Erreur interne du serveur." : error.message || "Erreur interne du serveur.",
      errors: error.errors || [],
    });
  };
}
