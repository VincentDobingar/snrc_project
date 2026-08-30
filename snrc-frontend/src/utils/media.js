const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || "";

export function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/images/")) return path;
  return `${uploadsBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatDate(value, fallback = "Communication institutionnelle") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
