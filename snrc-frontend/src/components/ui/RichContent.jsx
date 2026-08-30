import DOMPurify from "dompurify";

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || "";

function containsHtml(content) {
  return /<\/?[a-z][\s\S]*>/i.test(content || "");
}

function resolveUploadsPaths(html) {
  if (!uploadsBaseUrl) return html;
  return html.replace(/((?:src|poster)=")(\/uploads\/[^"]*)"/g, `$1${uploadsBaseUrl}$2"`);
}

export default function RichContent({ content, className = "" }) {
  if (!content) return null;

  if (containsHtml(content)) {
    return (
      <div
        className={`rich-content ${className}`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resolveUploadsPaths(content)) }}
      />
    );
  }

  const paragraphs = content
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className={`rich-content ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}