import { body } from "express-validator";

export const jobApplicationValidator = [
  body("full_name").trim().notEmpty().withMessage("Nom complet requis"),
  body("email").isEmail().withMessage("Email invalide"),
  body("phone").optional().trim(),
  body("education_level").optional().trim(),
  body("cover_letter_text")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("La lettre de motivation ne peut pas dépasser 5000 caractères"),
];
