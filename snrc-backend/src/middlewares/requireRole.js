export function requireRole(...roles) {
  return function checkRole(req, _res, next) {
    if (!req.user) {
      const error = new Error("Authentification requise");
      error.status = 401;
      return next(error);
    }
    if (!roles.includes(req.user.role)) {
      const error = new Error("Accès refusé");
      error.status = 403;
      return next(error);
    }
    return next();
  };
}
