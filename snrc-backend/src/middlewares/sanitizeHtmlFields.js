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
  // "style" reste autorisé (mise en forme de l'éditeur riche) mais restreint à
  // des propriétés de présentation inoffensives : pas de position/top/left/
  // z-index, qui permettraient à un contenu admin compromis de superposer un
  // élément par-dessus le reste de la page (spoofing visuel/clickjacking).
  allowedStyles: {
    "*": {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(/i, /^rgba\(/i, /^[a-z]+$/i],
      "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb\(/i, /^rgba\(/i, /^[a-z]+$/i],
      "text-align": [/^(left|right|center|justify)$/],
      "font-weight": [/^(bold|normal|[1-9]00)$/],
      "font-style": [/^(italic|normal)$/],
      "text-decoration": [/^(underline|line-through|none)$/],
    },
  },
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
