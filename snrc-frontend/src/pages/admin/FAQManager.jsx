import { useEffect, useMemo, useState } from "react";
import {
  createAdminFaq,
  deleteAdminFaq,
  getAdminFaqs,
  updateAdminFaq,
} from "../../api/adminApi";

const initialForm = {
  question: "",
  answer: "",
  display_order: 0,
  status: "active",
};

export default function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    setLoading(true);
    try {
      const data = await getAdminFaqs();
      setFaqs(data);
    } catch (error) {
      setFeedback(
        error?.response?.data?.message || "Impossible de charger la FAQ."
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
    setForm((prev) => ({
      ...prev,
      [name]: name === "display_order" ? Number(value) : value,
    }));
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      question: item.question || "",
      answer: item.answer || "",
      display_order: item.display_order || 0,
      status: item.status || "active",
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
        const result = await updateAdminFaq(editingId, form);
        setFeedback(result?.message || "FAQ mise à jour avec succès.");
      } else {
        const result = await createAdminFaq(form);
        setFeedback(result?.message || "FAQ créée avec succès.");
      }

      await loadFaqs();
      resetForm();
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFeedback(validationErrors.map((item) => item.message).join(" • "));
      } else {
        setFeedback(
          error?.response?.data?.message ||
            "Erreur lors de l’enregistrement de la FAQ."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette question FAQ ?"
    );
    if (!confirmed) return;

    try {
      const result = await deleteAdminFaq(item.id);
      setFeedback(result?.message || "FAQ supprimée avec succès.");
      await loadFaqs();

      if (editingId === item.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message || "Erreur lors de la suppression."
      );
    }
  }

  const sortedFaqs = useMemo(() => {
    return [...faqs].sort(
      (a, b) => (a.display_order || 0) - (b.display_order || 0)
    );
  }, [faqs]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          FAQ
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Gestion de la FAQ
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Créez, modifiez et organisez les questions fréquentes du site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-snrc p-6 lg:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              {editingId ? "Modifier une question FAQ" : "Créer une question FAQ"}
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

        <div className="mt-8 grid gap-6">
          <div>
            <label
              htmlFor="faq-question"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Question
            </label>
            <input
              id="faq-question"
              type="text"
              name="question"
              value={form.question}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Question fréquente"
            />
          </div>

          <div>
            <label
              htmlFor="faq-answer"
              className="mb-2 block font-medium text-snrc-blue"
            >
              Réponse
            </label>
            <textarea
              id="faq-answer"
              rows="6"
              name="answer"
              value={form.answer}
              onChange={handleChange}
              className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              placeholder="Réponse détaillée"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="faq-display_order"
                className="mb-2 block font-medium text-snrc-blue"
              >
                Ordre d’affichage
              </label>
              <input
                id="faq-display_order"
                type="number"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              />
            </div>

            <div>
              <label
                htmlFor="faq-status"
                className="mb-2 block font-medium text-snrc-blue"
              >
                Statut
              </label>
              <select
                id="faq-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
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
              ? "Mettre à jour la FAQ"
              : "Créer la FAQ"}
          </button>
        </div>
      </form>

      <div className="card-snrc overflow-hidden">
        <div className="border-b border-snrc-blue/10 px-6 py-5">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Liste des questions FAQ
          </h3>
          <p className="mt-1 text-sm text-snrc-blue/70">
            Questions enregistrées dans le système.
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue">Chargement de la FAQ...</p>
          </div>
        ) : sortedFaqs.length === 0 ? (
          <div className="p-6">
            <p className="font-medium text-snrc-blue/80">
              Aucune question FAQ disponible.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-snrc-light">
                <tr className="text-left text-sm text-snrc-blue">
                  <th className="px-6 py-4 font-semibold">Question</th>
                  <th className="px-6 py-4 font-semibold">Ordre</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedFaqs.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-snrc-blue/10 text-sm"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-snrc-blue">
                          {item.question}
                        </p>
                        {item.answer ? (
                          <p className="mt-1 line-clamp-2 text-snrc-blue/70">
                            {item.answer}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-snrc-blue/80">
                      {item.display_order ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status === "active" ? "Actif" : "Inactif"}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}