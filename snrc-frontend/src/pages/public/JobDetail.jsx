import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Send } from "lucide-react";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { applyToJob, getJobBySlug } from "../../api/jobsApi";
import usePageMeta from "../../hooks/usePageMeta";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  education_level: "",
  cover_letter_text: "",
};

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR");
}

export default function JobDetail() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loadedSlug, setLoadedSlug] = useState(null);
  const loading = loadedSlug !== slug;

  const [form, setForm] = useState(initialForm);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getJobBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
          setJob(null);
        } else {
          setNotFound(false);
          setJob(data);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
        setJob(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadedSlug(slug);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cvFile) {
      setFeedback("Le CV est obligatoire.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("cv", cvFile);
      if (coverLetterFile) {
        formData.append("cover_letter_file", coverLetterFile);
      }

      const result = await applyToJob(job.id, formData);
      setFeedback(result?.message || "Candidature envoyée avec succès.");
      setSuccess(true);
      setForm(initialForm);
      setCvFile(null);
      setCoverLetterFile(null);
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de l’envoi de la candidature."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const pageMeta = usePageMeta(
    loading
      ? { title: "Chargement..." }
      : notFound || !job
      ? { title: "Offre introuvable", noindex: true }
      : { title: job.title, description: job.summary }
  );

  if (loading) {
    return (
      <section className="section-snrc bg-white">
        {pageMeta}
        <Container>
          <p className="text-snrc-blue/80">Chargement de l’offre...</p>
        </Container>
      </section>
    );
  }

  if (notFound || !job) {
    return (
      <section className="section-snrc bg-white">
        {pageMeta}
        <Container className="text-center">
          <h1 className="font-display text-3xl font-bold text-snrc-blue">
            Offre introuvable
          </h1>
          <p className="mt-4 text-snrc-blue/80">
            Cette offre n’existe pas ou n’est plus disponible.
          </p>
          <Link to="/carrieres" className="btn-snrc-primary mt-8 inline-flex">
            <ArrowLeft size={18} />
            Retour aux carrières
          </Link>
        </Container>
      </section>
    );
  }

  const deadline = formatDate(job.application_deadline);

  return (
    <>
      {pageMeta}

      <PageBanner
        title={job.title}
        subtitle={job.summary}
        badge="Carrières"
        backgroundImage="/images/sections/snrc.jpg"
      />

      <section className="section-snrc bg-white">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <Link
              to="/carrieres"
              className="inline-flex items-center gap-2 font-semibold text-snrc-blue"
            >
              <ArrowLeft size={18} />
              Retour aux carrières
            </Link>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-snrc-blue/75">
              {job.contract_type ? (
                <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 font-semibold text-snrc-blue">
                  {job.contract_type}
                </span>
              ) : null}

              {job.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} />
                  {job.location}
                </span>
              ) : null}

              {deadline ? (
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} />
                  Candidature avant le {deadline}
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
              {job.title}
            </h2>

            <RichContent content={job.description} className="mt-6" />

            {job.requirements ? (
              <>
                <h2 className="mt-8 font-display text-2xl font-bold text-snrc-blue">
                  Profil recherché
                </h2>
                <RichContent content={job.requirements} className="mt-4" />
              </>
            ) : null}
          </div>

          <article className="card-snrc p-6 lg:sticky lg:top-28 lg:p-8">
            <h2 className="font-display text-2xl font-bold text-snrc-blue">
              Postuler à cette offre
            </h2>

            {success ? (
              <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {feedback}
              </p>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="job-apply-full_name"
                    className="mb-2 block font-medium text-snrc-blue"
                  >
                    Nom complet
                  </label>
                  <input
                    id="job-apply-full_name"
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-apply-email"
                    className="mb-2 block font-medium text-snrc-blue"
                  >
                    Email
                  </label>
                  <input
                    id="job-apply-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                    placeholder="Votre adresse email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-apply-phone"
                    className="mb-2 block font-medium text-snrc-blue"
                  >
                    Téléphone
                  </label>
                  <input
                    id="job-apply-phone"
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                    placeholder="Votre numéro"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-apply-education_level"
                    className="mb-2 block font-medium text-snrc-blue"
                  >
                    Diplôme / niveau d’étude
                  </label>
                  <input
                    id="job-apply-education_level"
                    type="text"
                    name="education_level"
                    value={form.education_level}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                    placeholder="Ex : Licence en droit, Bac+5..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-apply-cover_letter_text"
                    className="mb-2 block font-medium text-snrc-blue"
                  >
                    Lettre de motivation
                  </label>
                  <textarea
                    id="job-apply-cover_letter_text"
                    rows="4"
                    name="cover_letter_text"
                    value={form.cover_letter_text}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                    placeholder="Présentez votre motivation pour ce poste"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-apply-cv"
                    className="mb-2 block font-medium text-snrc-blue"
                  >
                    CV (PDF ou Word) *
                  </label>
                  <input
                    id="job-apply-cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-apply-cover-letter-file"
                    className="mb-2 block font-medium text-snrc-blue"
                  >
                    Lettre de motivation (fichier PDF, optionnel)
                  </label>
                  <input
                    id="job-apply-cover-letter-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCoverLetterFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                  />
                </div>

                {feedback ? (
                  <p className="text-sm font-medium text-snrc-red">{feedback}</p>
                ) : null}

                <button
                  type="submit"
                  className="btn-snrc-primary inline-flex items-center gap-2"
                  disabled={submitting}
                >
                  <Send size={18} />
                  {submitting ? "Envoi..." : "Envoyer ma candidature"}
                </button>
              </form>
            )}
          </article>
        </Container>
      </section>
    </>
  );
}
