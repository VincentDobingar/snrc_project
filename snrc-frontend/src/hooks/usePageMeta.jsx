import { Helmet } from "react-helmet-async";

const SITE_NAME = "SNRC - Société Nationale de Recouvrement des Créances";
const DEFAULT_DESCRIPTION =
  "Site officiel de la SNRC, institution nationale tchadienne chargée du recouvrement, du suivi et de la valorisation des créances publiques.";

export default function usePageMeta({ title, description, image } = {}) {
  const fullTitle = title ? `${title} | SNRC` : SITE_NAME;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      {image ? <meta property="og:image" content={image} /> : null}
    </Helmet>
  );
}
