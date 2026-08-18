import { useEffect, useMemo, useState } from "react";
import {
  deleteAdminJobApplication,
  getAdminJobApplicationById,
  getAdminJobApplications,
  markAdminJobApplicationRead,
} from "../../api/adminApi";

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || "";

function resolveFileUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${uploadsBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR");
}

const statusLabels = {
  nouveau: { label: "Nouveau", className: "bg-green-100 text-green-700" },
  lu: { label: "Lu", className: "bg-gray-100 text-gray-600" },
  traite: { label: "Traité", className: "bg-blue-100 text-blue-700" },
};

export default function JobApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    try {
      const data = await getAdminJobApplications();
      setApplications(data);

      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les candidatures."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(application) {
    try {
      const detail = await getAdminJobApplicationById(application.id);
      setSelected(detail || application);

      if (!application.is_read) {
        await markAdminJobApplicationRead(application.id);
        await loadApplications();
      }
    } catch {
      setSelected(application);
    }
  }

  async function handleDelete(application) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la candidature de "${application.full_name}" ?`
    );
    if (!confirmed) return;

    try {
      const result = await deleteAdminJobApplication(application.id);
      setFeedback(result?.message || "Candidature supprimée avec succès.");
      await loadApplications();

      setSelected((current) =>
        current?.id === application.id ? null : current
      );
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de la suppression de la candidature."
      );
    }
  }

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
  }, [applications]);

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Recrutement
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Candidatures reçues
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Consultez les candidatures envoyées depuis les offres d’emploi publiées.
        </p>
      </div>

      {feedback ? (
        <div className="rounded-xl border border-snrc-blue/10 bg-snrc-light px-4 py-3 text-sm font-medium text-snrc-blue">
          {feedback}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-snrc overflow-hidden">
          <div className="border-b border-snrc-blue/10 px-6 py-5">
            <h3 className="font-display text-2xl font-bold text-snrc-blue">
              Liste des candidatures
            </h3>
          </div>

          {loading ? (
            <div className="p-6">
              <p className="font-medium text-snrc-blue">
                Chargement des candidatures...
              </p>
            </div>
          ) : sortedApplications.length === 0 ? (
            <div className="p-6">
              <p className="font-medium text-snrc-blue/80">
                Aucune candidature reçue pour le moment.
              </p>
            </div>
          ) : (
            <div className="max-h-[720px] overflow-y-auto">
              {sortedApplications.map((application) => {
                const statusInfo =
                  statusLabels[application.status] || statusLabels.nouveau;
                return (
                  <button
                    key={application.id}
                    type="button"
                    onClick={() => handleSelect(application)}
                    className={`w-full border-b border-snrc-blue/10 px-6 py-5 text-left transition ${
                      selected?.id === application.id
                        ? "bg-snrc-light"
                        : "hover:bg-snrc-light/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-snrc-blue">
                          {application.full_name}
                        </p>
                        <p className="mt-1 text-sm text-snrc-blue/70">
                          {application.job_title}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-snrc-blue/60">
                      {formatDate(application.created_at)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="card-snrc p-6 lg:p-8">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Détail de la candidature
          </h3>

          {!selected ? (
            <p className="mt-4 text-snrc-blue/75">
              Sélectionnez une candidature dans la liste.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Offre concernée
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selected.job_title}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Nom complet
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selected.full_name}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">Email</p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selected.email}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Téléphone
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selected.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Diplôme / niveau d’étude
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {selected.education_level || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-snrc-blue/70">
                  Date de candidature
                </p>
                <p className="mt-1 font-semibold text-snrc-blue">
                  {formatDate(selected.created_at)}
                </p>
              </div>

              {selected.cover_letter_text ? (
                <div>
                  <p className="text-sm font-medium text-snrc-blue/70">
                    Lettre de motivation
                  </p>
                  <div className="mt-2 rounded-2xl bg-snrc-light p-4 leading-7 text-snrc-blue/85">
                    {selected.cover_letter_text}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <a
                  href={resolveFileUrl(selected.cv_file)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-snrc-primary"
                >
                  Télécharger le CV
                </a>

                {selected.cover_letter_file ? (
                  <a
                    href={resolveFileUrl(selected.cover_letter_file)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-snrc-blue/15 px-5 py-3 font-medium text-snrc-blue transition hover:bg-snrc-light"
                  >
                    Télécharger la lettre
                  </a>
                ) : null}

                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    `Votre candidature — ${selected.job_title}`
                  )}`}
                  className="rounded-xl border border-snrc-blue/15 px-5 py-3 font-medium text-snrc-blue transition hover:bg-snrc-light"
                >
                  Répondre par email
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(selected)}
                  className="rounded-xl border border-snrc-red/20 px-5 py-3 font-medium text-snrc-red transition hover:bg-snrc-red hover:text-white"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
