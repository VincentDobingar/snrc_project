import { body } from "express-validator";

export const createAdminUserValidator = [
  body("full_name").trim().notEmpty().withMessage("Nom complet requis"),
  body("email").isEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("role").optional().isIn(["superadmin", "admin_editeur"]).withMessage("Rôle invalide"),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Statut invalide"),
];

export const updateAdminUserValidator = [
  body("full_name").optional().trim().notEmpty().withMessage("Nom complet invalide"),
  body("email").optional().isEmail().withMessage("Email invalide"),
  body("role").optional().isIn(["superadmin", "admin_editeur"]).withMessage("Rôle invalide"),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Statut invalide"),
];

export const updatePasswordValidator = [
  body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];
