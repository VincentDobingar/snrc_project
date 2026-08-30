import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link2,
  Quote,
  Undo2,
  Redo2,
  Eye,
  Code2,
  Eraser,
} from "lucide-react";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function RichEditorField({
  label,
  value,
  onChange,
  placeholder = "Saisissez le contenu...",
  minHeight = "280px",
}) {
  const editorRef = useRef(null);
  const [htmlMode, setHtmlMode] = useState(false);
  const [activeFormats, setActiveFormats] = useState({});

  useEffect(() => {
    if (!htmlMode && editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, htmlMode]);

  function updateActiveFormats() {
    if (htmlMode || !editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || !editorRef.current.contains(selection.anchorNode)) return;

    let formatBlockValue = "";
    try {
      formatBlockValue = (document.queryCommandValue("formatBlock") || "").toLowerCase();
    } catch {
      formatBlockValue = "";
    }

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      h2: formatBlockValue === "h2",
      blockquote: formatBlockValue === "blockquote",
    });
  }

  useEffect(() => {
    if (htmlMode) return undefined;
    document.addEventListener("selectionchange", updateActiveFormats);
    return () => document.removeEventListener("selectionchange", updateActiveFormats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlMode]);

  function syncContent() {
    onChange(editorRef.current?.innerHTML || "");
  }

  function exec(command, arg = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    syncContent();
    updateActiveFormats();
  }

  function handleLink() {
    const url = window.prompt("Entrez l’URL du lien :", "https://");
    if (!url) return;
    exec("createLink", url);
  }

  function handleCodeBlock() {
    const selected = window.getSelection()?.toString() || "Votre code ici";
    const html = `<pre><code>${escapeHtml(selected)}</code></pre>`;
    exec("insertHTML", html);
  }

  function handleClear() {
    if (htmlMode) {
      onChange("");
      return;
    }

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    onChange("");
  }

  const tools = [
    {
      icon: Undo2,
      label: "Annuler",
      action: () => exec("undo"),
    },
    {
      icon: Redo2,
      label: "Rétablir",
      action: () => exec("redo"),
    },
    {
      icon: Bold,
      label: "Gras",
      action: () => exec("bold"),
      stateKey: "bold",
    },
    {
      icon: Italic,
      label: "Italique",
      action: () => exec("italic"),
      stateKey: "italic",
    },
    {
      icon: Heading2,
      label: "Titre",
      action: () => exec("formatBlock", "h2"),
      stateKey: "h2",
    },
    {
      icon: Quote,
      label: "Citation",
      action: () => exec("formatBlock", "blockquote"),
      stateKey: "blockquote",
    },
    {
      icon: List,
      label: "Liste à puces",
      action: () => exec("insertUnorderedList"),
      stateKey: "insertUnorderedList",
    },
    {
      icon: ListOrdered,
      label: "Liste numérotée",
      action: () => exec("insertOrderedList"),
      stateKey: "insertOrderedList",
    },
    {
      icon: Link2,
      label: "Lien",
      action: handleLink,
    },
    {
      icon: Code2,
      label: "Bloc code",
      action: handleCodeBlock,
    },
    {
      icon: Eraser,
      label: "Effacer",
      action: handleClear,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="block font-medium text-snrc-blue">{label}</label>

        <button
          type="button"
          onClick={() => setHtmlMode((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-snrc-blue/15 px-3 py-2 text-sm font-medium text-snrc-blue transition hover:bg-snrc-light"
        >
          <Eye size={16} />
          {htmlMode ? "Mode visuel" : "Mode HTML"}
        </button>
      </div>

      {!htmlMode ? (
        <>
          <div className="editor-toolbar">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  type="button"
                  onClick={tool.action}
                  className="editor-tool-btn"
                  title={tool.label}
                  aria-pressed={
                    tool.stateKey ? Boolean(activeFormats[tool.stateKey]) : undefined
                  }
                >
                  <Icon size={16} />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="editor-surface"
            style={{ minHeight }}
            data-placeholder={placeholder}
            onInput={syncContent}
            onBlur={syncContent}
          />
        </>
      ) : (
        <textarea
          rows="12"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-snrc-blue/15 px-4 py-4 font-mono text-sm outline-none transition focus:border-snrc-blue"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}