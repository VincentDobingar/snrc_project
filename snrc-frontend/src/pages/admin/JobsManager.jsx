import { useEffect, useMemo, useState } from "react";
import {
  createAdminJob,
  deleteAdminJob,
  getAdminJobs,
  updateAdminJob,
} from "../../api/adminApi";
import RichEditorField from "../../components/admin/RichEditorField";

const contractTypes = ["CDI", "CDD", "Stage", "Consultant"];

const initialForm = {
  title: "",
  slug: "",
  contract_type: "CDI",
  location: "",
  summary: "",
  description: "",
  requirements: "",
  application_deadline: "",
  status: "draft",
};

const DIACRITICS_REGEX = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g"
);

function slugifyText(value = "") {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
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

const statusLabels = {
  draft: { label: "Brouillon", className: "bg-amber-100 text-amber-700" },
  published: { label: "Publié", className: "bg-green-100 text-green-700" },
  closed: { label: "Fermé", className: "bg-gray-100 text-gray-600" },
};

export default function JobsManager() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setFeedback("");

    try {
      const data = await getAdminJobs();
      setJobs(data || []);
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les offres d’emploi."
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
      contract_type: item.contract_type || "CDI",
      location: item.location || "",
      summary: item.summary || "",
      description: item.description || "",
      requirements: item.requirements || "",
      application_deadline: toDateTimeLocal(item.application_deadline),
      status: item.status || "draft",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      const payload = {
        ...form,
        slug: slugifyText(form.slug || form.title),
        application_deadline: form.application_deadline || null,
      };

      if (editingId) {
        const result = await updateAdminJob(editingId, payload);
        setFeedback(result?.message || "Offre mise à jour avec succès.");
      } else {
        const result = await createAdminJob(payload);
        setFeedback(result?.message || "Offre créée avec succès.");
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
            "Erreur lors de l’enregistrement de l’offre."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l’offre "${item.title}" ?`
    );
    if (!confirmed) return;

    try {
      const result = await deleteAdminJob(item.id);
      setFeedback(result?.message || "Offre supprimée avec succès.");
      await loadData();

      if (editingId === item.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de la suppression de l’offre."
      );
    }
  }

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [jobs]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Recrutement
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Gestion des offres d’emploi
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Créez, modifiez et publiez les offres d’emploi de la SNRC.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-snrc p-6 lg:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              {editingId ? "Modifier une offre" : "Créer une offre"}
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
            <label
              htmlFor="job-title"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Titre du poste
            </label>
            <input
              id="job-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Ex : Chargé(e) de recouvrement"
            />
          </div>

          <div>
            <label
              htmlFor="job-slug"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Slug
            </label>
            <input
              id="job-slug"
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="slug-de-l-offre"
            />
          </div>

          <div>
            <label
              htmlFor="job-contract_type"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Type de contrat
            </label>
            <select
              id="job-contract_type"
              name="contract_type"
              value={form.contract_type}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            >
              {contractTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="job-location"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Lieu
            </label>
            <input
              id="job-location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Ex : N’Djamena, Tchad"
            />
          </div>

          <div>
            <label
              htmlFor="job-application_deadline"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Date limite de candidature
            </label>
            <input
              id="job-application_deadline"
              type="datetime-local"
              name="application_deadline"
              value={form.application_deadline}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            />
          </div>

          <div>
            <label
              htmlFor="job-status"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Statut
            </label>
            <select
              id="job-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="closed">Fermé</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="job-summary"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Résumé
            </label>
            <textarea
              id="job-summary"
              rows="3"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Résumé court affiché dans la liste des offres"
            />
          </div>

          <div className="md:col-span-2">
            <RichEditorField
              label="Description du poste"
              value={form.description}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, description: value }))
              }
              placeholder="Missions, contexte, responsabilités..."
              minHeight="220px"
            />
          </div>

          <div className="md:col-span-2">
            <RichEditorField
              label="Profil recherché"
              value={form.requirements}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, requirements: value }))
              }
              placeholder="Compétences, diplômes, expérience requise..."
              minHeight="180px"
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
              ? "Mettre à jour l’offre"
              : "Créer l’offre"}
          </button>
        </div>
      </form>

      <div className="card-snrc overflow-hidden">
        <div className="border-b border-snrc-blue/10 px-6 py-5">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Liste des offres
          </h3>
          <p className="mt-1 text-sm text-snrc-blue/70">
            Offres d’emploi enregistrées dans le système.
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue">Chargement des offres...</p>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue/80">
              Aucune offre d’emploi disponible.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-snrc-light">
                <tr className="text-left text-sm text-snrc-blue">
                  <th className="px-6 py-4 font-semibold">Poste</th>
                  <th className="px-6 py-4 font-semibold">Contrat</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Date limite</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedJobs.map((item) => {
                  const statusInfo = statusLabels[item.status] || statusLabels.draft;
                  return (
                    <tr key={item.id} className="border-t border-snrc-blue/10 text-sm">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-snrc-blue">{item.title}</p>
                        {item.location ? (
                          <p className="mt-1 text-snrc-blue/70">{item.location}</p>
                        ) : null}
                      </td>

                      <td className="px-6 py-4 text-snrc-blue/80">
                        {item.contract_type || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-snrc-blue/80">
                        {item.application_deadline
                          ? new Date(item.application_deadline).toLocaleDateString("fr-FR")
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
