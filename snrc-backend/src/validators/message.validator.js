import { body } from "express-validator";

export const contactMessageValidator = [
  body("full_name").trim().notEmpty().withMessage("Nom complet requis").isLength({ max: 150 }).withMessage("Nom complet trop long (150 caractères maximum)"),
  body("email").isEmail().withMessage("Email invalide").isLength({ max: 150 }).withMessage("Email trop long (150 caractères maximum)"),
  body("subject").trim().notEmpty().withMessage("Sujet requis").isLength({ max: 180 }).withMessage("Sujet trop long (180 caractères maximum)"),
  body("message").trim().notEmpty().withMessage("Message requis").isLength({ max: 5000 }).withMessage("Message trop long (5000 caractères maximum)"),
  body("phone").optional().trim().isLength({ max: 50 }).withMessage("Numéro de téléphone trop long (50 caractères maximum)"),
];
