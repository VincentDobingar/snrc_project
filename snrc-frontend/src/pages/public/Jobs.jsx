import { useEffect, useState } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getPageBySlug } from "../../api/pagesApi";
import { getJobs } from "../../api/jobsApi";
import usePageMeta from "../../hooks/usePageMeta";

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR");
}

export default function Jobs() {
  const [page, setPage] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    getPageBySlug("carrieres")
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoadingPage(false));
  }, []);

  useEffect(() => {
    getJobs()
      .then((data) => setJobs(data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoadingJobs(false));
  }, []);

  const title = page?.title || "Carrières";
  const summary =
    page?.summary ||
    "Découvrez les offres d’emploi de la SNRC et déposez votre candidature en ligne.";

  const content =
    page?.content ||
    `<p>La rubrique Carrières présente les offres d’emploi ouvertes au sein de la Société Nationale de Recouvrement des Créances (SNRC).</p>
     <p>Elle permet aux candidats de consulter les postes disponibles et de déposer leur candidature directement en ligne, avec CV et lettre de motivation.</p>`;

  return (
    <>
      {usePageMeta({ title, description: summary })}

      <PageBanner
        title={title}
        subtitle={summary}
        badge="Carrières"
        backgroundImage="/images/sections/snrc.jpg"
      />

      <section className="section-snrc bg-white">
        <Container className="max-w-3xl">
          <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
            Rejoignez la SNRC
          </span>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
            {loadingPage ? "Chargement..." : title}
          </h2>

          <RichContent content={content} className="mt-4" />
        </Container>
      </section>

      <section className="section-snrc bg-snrc-light">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
              Offres ouvertes
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
              Postes à pourvoir
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {loadingJobs ? (
              <p className="text-snrc-blue/80">Chargement des offres...</p>
            ) : jobs.length === 0 ? (
              <p className="text-snrc-blue/80">
                Aucune offre d’emploi disponible pour le moment.
              </p>
            ) : (
              jobs.map((job) => {
                const deadline = formatDate(job.application_deadline);
                return (
                  <article key={job.id} className="card-snrc p-6">
                    <div className="inline-flex rounded-2xl bg-snrc-blue/10 p-3 text-snrc-blue">
                      <Briefcase size={24} />
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold text-snrc-blue">
                      {job.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-snrc-blue/75">
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
                          Avant le {deadline}
                        </span>
                      ) : null}
                    </div>

                    {job.summary ? (
                      <p className="mt-3 leading-7 text-snrc-blue/80">
                        {job.summary}
                      </p>
                    ) : null}

                    <Link
                      to={`/carrieres/${job.slug}`}
                      className="mt-5 btn-snrc-outline inline-flex"
                    >
                      Voir l’offre et postuler
                    </Link>
                  </article>
                );
              })
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
