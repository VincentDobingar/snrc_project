import { useEffect, useMemo, useState } from "react";
import RichEditorField from "../../components/admin/RichEditorField";
import {
  createAdminPage,
  deleteAdminPage,
  getAdminPages,
  updateAdminPage,
} from "../../api/adminApi";

const initialForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  banner_image: "",
  meta_title: "",
  meta_description: "",
  status: "published",
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PagesManager() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    try {
      const data = await getAdminPages();
      setPages(data);
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les pages."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "title" && (!prev.slug || prev.slug === slugify(prev.title))) {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  function handleEdit(page) {
    setEditingId(page.id);
    setForm({
      title: page.title || "",
      slug: page.slug || "",
      summary: page.summary || "",
      content: page.content || "",
      banner_image: page.banner_image || "",
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      status: page.status || "published",
    });
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      if (editingId) {
        const result = await updateAdminPage(editingId, form);
        setFeedback(result?.message || "Page mise à jour avec succès.");
      } else {
        const result = await createAdminPage(form);
        setFeedback(result?.message || "Page créée avec succès.");
      }

      await loadPages();
      resetForm();
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        "Erreur lors de l’enregistrement de la page.";

      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFeedback(
          validationErrors.map((item) => item.message).join(" • ")
        );
      } else {
        setFeedback(apiMessage);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(page) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la page "${page.title}" ?`
    );
    if (!confirmed) return;

    try {
      const result = await deleteAdminPage(page.id);
      setFeedback(result?.message || "Page supprimée avec succès.");
      await loadPages();

      if (editingId === page.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de la suppression de la page."
      );
    }
  }

  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [pages]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Pages
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Gestion des pages
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Créez et modifiez les pages institutionnelles du site : présentation,
          missions, contact et autres contenus statiques.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-snrc p-6 lg:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              {editingId ? "Modifier une page" : "Créer une nouvelle page"}
            </h3>
            <p className="mt-1 text-sm text-snrc-blue/70">
              Renseignez les champs ci-dessous puis enregistrez.
            </p>
          </div>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-snrc-blue/15 px-4 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
            >
              Annuler la modification
            </button>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="page-title"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Titre
            </label>
            <input
              id="page-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Titre de la page"
            />
          </div>

          <div>
            <label
              htmlFor="page-slug"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Slug
            </label>
            <input
              id="page-slug"
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="la-snrc"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="page-summary"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Résumé
            </label>
            <textarea
              id="page-summary"
              rows="3"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Résumé court de la page"
            />
          </div>

          <div className="md:col-span-2">
            <RichEditorField
              label="Contenu"
              value={form.content}
              onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
              placeholder="Contenu principal de la page"
              minHeight="320px"
            />
          </div>

          <div>
            <label
              htmlFor="page-banner_image"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Image de bannière
            </label>
            <input
              id="page-banner_image"
              type="text"
              name="banner_image"
              value={form.banner_image}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="/images/sections/snrc.jpg"
            />
          </div>

          <div>
            <label
              htmlFor="page-status"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Statut
            </label>
            <select
              id="page-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            >
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="page-meta_title"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Meta title
            </label>
            <input
              id="page-meta_title"
              type="text"
              name="meta_title"
              value={form.meta_title}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Meta title"
            />
          </div>

          <div>
            <label
              htmlFor="page-meta_description"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Meta description
            </label>
            <input
              id="page-meta_description"
              type="text"
              name="meta_description"
              value={form.meta_description}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Meta description"
            />
          </div>
        </div>

        {feedback ? (
          <div className="mt-6 rounded-xl border border-snrc-blue/10 bg-snrc-light px-4 py-3 text-sm font-medium text-snrc-blue">
            {feedback}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-snrc-blue/15 px-5 py-3 font-medium text-snrc-blue transition hover:bg-snrc-light"
          >
            Réinitialiser
          </button>

          <button type="submit" className="btn-snrc-primary" disabled={saving}>
            {saving
              ? "Enregistrement..."
              : editingId
              ? "Mettre à jour la page"
              : "Créer la page"}
          </button>
        </div>
      </form>

      <div className="card-snrc overflow-hidden">
        <div className="border-b border-snrc-blue/10 px-6 py-5">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Liste des pages
          </h3>
          <p className="mt-1 text-sm text-snrc-blue/70">
            Pages actuellement enregistrées dans le système.
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue">Chargement des pages...</p>
          </div>
        ) : sortedPages.length === 0 ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue/80">
              Aucune page disponible.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-snrc-light">
                <tr className="text-left text-sm text-snrc-blue">
                  <th className="px-6 py-4 font-semibold">Titre</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedPages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-t border-snrc-blue/10 text-sm"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-snrc-blue">
                          {page.title}
                        </p>
                        {page.summary ? (
                          <p className="mt-1 line-clamp-2 text-snrc-blue/70">
                            {page.summary}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-snrc-blue/80">
                      {page.slug}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          page.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {page.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(page)}
                          className="rounded-lg border border-snrc-blue/15 px-3 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(page)}
                          className="rounded-lg border border-snrc-red/20 px-3 py-2 font-medium text-snrc-red transition hover:bg-snrc-red hover:text-white"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}