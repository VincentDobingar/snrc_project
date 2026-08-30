import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "u", "span", "video", "source"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height"],
    a: ["href", "name", "target", "rel"],
    video: ["src", "controls", "poster", "width", "height", "preload"],
    source: ["src", "type"],
    "*": ["style", "class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
};

// Nettoie le HTML riche produit par l'éditeur admin avant écriture en base :
// retire <script>, gestionnaires on*, javascript:, iframes, etc. Le contenu est
// affiché tel quel côté public via dangerouslySetInnerHTML, donc ce filtrage
// côté serveur est la seule barrière fiable (le frontend ne peut pas être
// considéré comme une source de confiance).
export function sanitizeHtmlFields(...fields) {
  return function sanitize(req, _res, next) {
    fields.forEach((field) => {
      if (typeof req.body?.[field] === "string") {
        req.body[field] = sanitizeHtml(req.body[field], SANITIZE_OPTIONS);
      }
    });
    return next();
  };
}
