import { useEffect, useMemo, useState } from "react";
import {
  createAdminNews,
  deleteAdminNews,
  getAdminNews,
  updateAdminNews,
} from "../../api/adminApi";
import { uploadImage } from "../../api/uploadApi";
import UploadField from "../../components/admin/UploadField";
import RichEditorField from "../../components/admin/RichEditorField";

const initialForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  featured_image: "",
  status: "draft",
  published_at: "",
};

function slugifyText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    setLoading(true);
    setFeedback("");

    try {
      const data = await getAdminNews();
      setNews(data || []);
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les actualités."
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
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "title" && !editingId) {
        next.slug = slugifyText(value);
      }

      return next;
    });
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setFeedback("");

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      summary: item.summary || "",
      content: item.content || "",
      featured_image: item.featured_image || "",
      status: item.status || "draft",
      published_at: toDateTimeLocal(item.published_at),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFeaturedImageUpload(file) {
    setUploadingImage(true);
    setFeedback("");

    try {
      const uploadedPath = await uploadImage(file);
      setForm((prev) => ({ ...prev, featured_image: uploadedPath }));
      setFeedback("Image de l’actualité envoyée avec succès.");
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l’envoi de l’image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      const payload = {
        ...form,
        slug: slugifyText(form.slug || form.title),
        published_at: form.published_at || null,
      };

      if (editingId) {
        const result = await updateAdminNews(editingId, payload);
        setFeedback(result?.message || "Actualité mise à jour avec succès.");
      } else {
        const result = await createAdminNews(payload);
        setFeedback(result?.message || "Actualité créée avec succès.");
      }

      await loadNews();
      resetForm();
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFeedback(validationErrors.map((item) => item.message).join(" • "));
      } else {
        setFeedback(
          error?.response?.data?.message ||
            "Erreur lors de l’enregistrement de l’actualité."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette actualité ?"
    );
    if (!confirmed) return;

    try {
      const result = await deleteAdminNews(item.id);
      setFeedback(result?.message || "Actualité supprimée avec succès.");
      await loadNews();

      if (editingId === item.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de la suppression de l’actualité."
      );
    }
  }

  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [news]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Actualités
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Gestion des actualités
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Ajoutez, modifiez et publiez les actualités institutionnelles de la SNRC.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-snrc p-6 lg:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              {editingId ? "Modifier une actualité" : "Créer une actualité"}
            </h3>
            <p className="mt-1 text-sm text-snrc-blue/70">
              Renseignez les champs puis enregistrez.
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
            <label className="mb-2 block font-medium text-snrc-blue">
              Titre
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Titre de l’actualité"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="slug-de-l-actualite"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-snrc-blue">
              Résumé
            </label>
            <textarea
              rows="4"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Résumé court de l’actualité"
            />
          </div>

          <div className="md:col-span-2">
            <RichEditorField
              label="Contenu"
              value={form.content}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, content: value }))
              }
              placeholder="Contenu complet de l’actualité"
              minHeight="320px"
            />
          </div>

          <div className="md:col-span-2">
            <UploadField
              label="Image mise en avant"
              value={form.featured_image}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, featured_image: value }))
              }
              onUpload={handleFeaturedImageUpload}
              uploading={uploadingImage}
              accept="image/*"
              placeholder="/images/news/news-1.png"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Date de publication
            </label>
            <input
              type="datetime-local"
              name="published_at"
              value={form.published_at}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Statut
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
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
              ? "Mettre à jour l’actualité"
              : "Créer l’actualité"}
          </button>
        </div>
      </form>

      <div className="card-snrc overflow-hidden">
        <div className="border-b border-snrc-blue/10 px-6 py-5">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Liste des actualités
          </h3>
          <p className="mt-1 text-sm text-snrc-blue/70">
            Actualités enregistrées dans le système.
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue">
              Chargement des actualités...
            </p>
          </div>
        ) : sortedNews.length === 0 ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue/80">
              Aucune actualité disponible.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-snrc-light">
                <tr className="text-left text-sm text-snrc-blue">
                  <th className="px-6 py-4 font-semibold">Titre</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedNews.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-snrc-blue/10 text-sm"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-snrc-blue">
                          {item.title}
                        </p>
                        {item.summary ? (
                          <p className="mt-1 line-clamp-2 text-snrc-blue/70">
                            {item.summary}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-snrc-blue/80">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="rounded-lg border border-snrc-blue/15 px-3 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
                        >
                          Modifier
                        </button>

                        {item.featured_image ? (
                          <a
                            href={item.featured_image}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-snrc-blue/15 px-3 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
                          >
                            Ouvrir l’image
                          </a>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
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