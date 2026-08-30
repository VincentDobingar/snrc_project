import { Helmet } from "react-helmet-async";

const SITE_NAME = "SNRC - Société Nationale de Recouvrement des Créances";
const OG_SITE_NAME = "SNRC — Société Nationale de Recouvrement des Créances";
const DEFAULT_DESCRIPTION =
  "Site officiel de la SNRC, institution nationale tchadienne chargée du recouvrement, du suivi et de la valorisation des créances publiques.";
const DEFAULT_IMAGE_PATH = "/images/logo-snrc.png";

function getOrigin() {
  const configuredUrl = import.meta.env.VITE_APP_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

function toAbsoluteUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${getOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

function getCurrentUrl() {
  if (typeof window !== "undefined") return window.location.href;
  return getOrigin();
}

export default function usePageMeta({
  title,
  description,
  image,
  noindex = false,
} = {}) {
  const fullTitle = title ? `${title} | SNRC` : SITE_NAME;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const pageUrl = getCurrentUrl();
  const ogImage = toAbsoluteUrl(image || DEFAULT_IMAGE_PATH);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={pageUrl} />
      {noindex ? (
        <meta name="robots" content="noindex" />
      ) : null}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={OG_SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
