function slugifyId(text) {
  return String(text || "field")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function UploadField({
  id,
  label,
  value,
  onChange,
  onUpload,
  uploading = false,
  accept = "*",
  placeholder = "",
}) {
  const fieldId = id || `upload-field-${slugifyId(label)}`;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    await onUpload(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      <label htmlFor={fieldId} className="block font-medium text-snrc-blue">
        {label}
      </label>

      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
        placeholder={placeholder}
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-xl border border-snrc-blue/15 px-4 py-3 font-medium text-snrc-blue transition hover:bg-snrc-light">
          {uploading ? "Envoi..." : "Choisir un fichier"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-snrc-blue/15 px-4 py-3 font-medium text-snrc-blue transition hover:bg-snrc-light"
          >
            Ouvrir
          </a>
        ) : null}
      </div>
    </div>
  );
}