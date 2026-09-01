import { body } from "express-validator";

export const updateSettingsValidator = [
  body("site_name").optional().trim().isLength({ max: 150 }).withMessage("Nom du site trop long (150 caractères maximum)"),
  body("site_tagline").optional().trim().isLength({ max: 255 }).withMessage("Slogan trop long (255 caractères maximum)"),
  body("site_description").optional().trim().isLength({ max: 2000 }).withMessage("Description trop longue (2000 caractères maximum)"),
  body("contact_email").optional({ checkFalsy: true }).isEmail().withMessage("Email de contact invalide").isLength({ max: 150 }),
  body("contact_phone").optional().trim().isLength({ max: 50 }).withMessage("Téléphone trop long (50 caractères maximum)"),
  body("contact_phone_secondary").optional().trim().isLength({ max: 50 }).withMessage("Téléphone secondaire trop long (50 caractères maximum)"),
  body("address").optional().trim().isLength({ max: 500 }).withMessage("Adresse trop longue (500 caractères maximum)"),
  body("footer_text").optional().trim().isLength({ max: 1000 }).withMessage("Texte de pied de page trop long (1000 caractères maximum)"),
  body("logo_url").optional().trim().isLength({ max: 255 }),
  body("favicon_url").optional().trim().isLength({ max: 255 }),
  body("facebook_url").optional({ checkFalsy: true }).isURL().withMessage("URL Facebook invalide").isLength({ max: 255 }),
  body("linkedin_url").optional({ checkFalsy: true }).isURL().withMessage("URL LinkedIn invalide").isLength({ max: 255 }),
  body("x_url").optional({ checkFalsy: true }).isURL().withMessage("URL X invalide").isLength({ max: 255 }),
  body("youtube_url").optional({ checkFalsy: true }).isURL().withMessage("URL YouTube invalide").isLength({ max: 255 }),
];
