import { useEffect, useMemo, useState } from "react";
import {
  createAdminPublication,
  deleteAdminPublication,
  getAdminPublications,
  getPublicationCategories,
  updateAdminPublication,
} from "../../api/adminApi";
import { uploadDocument, uploadImage } from "../../api/uploadApi";
import UploadField from "../../components/admin/UploadField";
import RichEditorField from "../../components/admin/RichEditorField";

const initialForm = {
  title: "",
  slug: "",
  category_id: "",
  description: "",
  file_url: "",
  cover_image: "",
  status: "draft",
  published_at: "",
};

const fallbackCategories = [
  { id: 1, name: "Rapports" },
  { id: 2, name: "Communiqués" },
  { id: 3, name: "Notes" },
  { id: 4, name: "Documents officiels" },
];

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

export default function PublicationsManager() {
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setFeedback("");

    try {
      const [publicationsData, categoriesData] = await Promise.all([
        getAdminPublications(),
        getPublicationCategories(),
      ]);

      setPublications(publicationsData || []);
      setCategories(
        Array.isArray(categoriesData) && categoriesData.length > 0
          ? categoriesData
          : fallbackCategories
      );
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les publications."
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
      category_id: item.category_id ? String(item.category_id) : "",
      description: item.description || "",
      file_url: item.file_url || "",
      cover_image: item.cover_image || "",
      status: item.status || "draft",
      published_at: toDateTimeLocal(item.published_at),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCoverUpload(file) {
    setUploadingCover(true);
    setFeedback("");

    try {
      const uploadedPath = await uploadImage(file);
      setForm((prev) => ({ ...prev, cover_image: uploadedPath }));
      setFeedback("Image de couverture envoyée avec succès.");
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l’envoi de l’image."
      );
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleDocumentUpload(file) {
    setUploadingDocument(true);
    setFeedback("");

    try {
      const uploadedPath = await uploadDocument(file);
      setForm((prev) => ({ ...prev, file_url: uploadedPath }));
      setFeedback("Document envoyé avec succès.");
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l’envoi du document."
      );
    } finally {
      setUploadingDocument(false);
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
        category_id: form.category_id ? Number(form.category_id) : null,
        published_at: form.published_at || null,
      };

      if (editingId) {
        const result = await updateAdminPublication(editingId, payload);
        setFeedback(result?.message || "Publication mise à jour avec succès.");
      } else {
        const result = await createAdminPublication(payload);
        setFeedback(result?.message || "Publication créée avec succès.");
      }

      await loadData();
      resetForm();
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFeedback(validationErrors.map((item) => item.message).join(" • "));
      } else {
        setFeedback(
          error?.response?.data?.message ||
            "Erreur lors de l’enregistrement de la publication."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette publication ?"
    );
    if (!confirmed) return;

    try {
      const result = await deleteAdminPublication(item.id);
      setFeedback(result?.message || "Publication supprimée avec succès.");
      await loadData();

      if (editingId === item.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de la suppression de la publication."
      );
    }
  }

  const sortedPublications = useMemo(() => {
    return [...publications].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [publications]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Publications
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Gestion des publications
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Ajoutez, modifiez et publiez les documents institutionnels de la SNRC.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-snrc p-6 lg:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              {editingId
                ? "Modifier une publication"
                : "Créer une publication"}
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
              placeholder="Titre de la publication"
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
              placeholder="slug-de-la-publication"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-snrc-blue">
              Catégorie
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
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

          <div className="md:col-span-2">
            <RichEditorField
              label="Description"
              value={form.description}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, description: value }))
              }
              placeholder="Description de la publication"
              minHeight="240px"
            />
          </div>

          <div className="md:col-span-2">
            <UploadField
              label="Document"
              value={form.file_url}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, file_url: value }))
              }
              onUpload={handleDocumentUpload}
              uploading={uploadingDocument}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
              placeholder="/uploads/documents/mon-document.pdf"
            />
          </div>

          <div className="md:col-span-2">
            <UploadField
              label="Image de couverture"
              value={form.cover_image}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, cover_image: value }))
              }
              onUpload={handleCoverUpload}
              uploading={uploadingCover}
              accept="image/*"
              placeholder="/images/publications/publication.png"
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
              ? "Mettre à jour la publication"
              : "Créer la publication"}
          </button>
        </div>
      </form>

      <div className="card-snrc overflow-hidden">
        <div className="border-b border-snrc-blue/10 px-6 py-5">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Liste des publications
          </h3>
          <p className="mt-1 text-sm text-snrc-blue/70">
            Publications enregistrées dans le système.
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue">
              Chargement des publications...
            </p>
          </div>
        ) : sortedPublications.length === 0 ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue/80">
              Aucune publication disponible.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-snrc-light">
                <tr className="text-left text-sm text-snrc-blue">
                  <th className="px-6 py-4 font-semibold">Titre</th>
                  <th className="px-6 py-4 font-semibold">Catégorie</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedPublications.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-snrc-blue/10 text-sm"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-snrc-blue">
                          {item.title}
                        </p>
                        {item.description ? (
                          <p className="mt-1 line-clamp-2 text-snrc-blue/70">
                            {item.description.replace(/<[^>]*>/g, "")}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-snrc-blue/80">
                      {item.category_name || "—"}
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

                        {item.file_url ? (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-snrc-blue/15 px-3 py-2 font-medium text-snrc-blue transition hover:bg-snrc-light"
                          >
                            Ouvrir
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