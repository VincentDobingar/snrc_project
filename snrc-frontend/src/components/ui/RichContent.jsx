import DOMPurify from "dompurify";

function containsHtml(content) {
  return /<\/?[a-z][\s\S]*>/i.test(content || "");
}

export default function RichContent({ content, className = "" }) {
  if (!content) return null;

  if (containsHtml(content)) {
    return (
      <div
        className={`rich-content ${className}`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
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