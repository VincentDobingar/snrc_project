import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Download, FileText, LibraryBig, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getPageBySlug } from "../../api/pagesApi";
import { getPublications } from "../../api/publicationsApi";
import usePageMeta from "../../hooks/usePageMeta";

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || "";

function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/images/")) return path;
  return `${uploadsBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(value) {
  if (!value) return "Document institutionnel";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Document institutionnel";
  return date.toLocaleDateString("fr-FR");
}

const highlights = [
  {
    title: "Documents officiels",
    text: "Diffusion de rapports, notes, documents de référence et autres contenus institutionnels liés au mandat de la SNRC.",
    icon: FileText,
  },
  {
    title: "Références institutionnelles",
    text: "Mise à disposition de ressources utiles à la compréhension du cadre d’intervention, du mandat et de l’environnement réglementaire.",
    icon: Scale,
  },
  {
    title: "Centralisation documentaire",
    text: "Un espace unique pour consulter les publications officielles et renforcer l’accès à l’information institutionnelle.",
    icon: LibraryBig,
  },
];

export default function Publications() {
  const [page, setPage] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingPublications, setLoadingPublications] = useState(true);

  useEffect(() => {
    getPageBySlug("publications")
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoadingPage(false));
  }, []);

  useEffect(() => {
    getPublications()
      .then((data) => setPublications(data || []))
      .catch(() => setPublications([]))
      .finally(() => setLoadingPublications(false));
  }, []);

  const title = page?.title || "Publications";
  const summary =
    page?.summary ||
    "Retrouvez dans cette rubrique les documents officiels, notes, rapports et publications institutionnelles de la SNRC.";

  const content =
    page?.content ||
    `<p>La rubrique Publications a vocation à centraliser les documents institutionnels de la SNRC et à faciliter l’accès à l’information officielle.</p>
     <p>Elle regroupe les rapports, notes, communiqués, documents de référence et autres ressources utiles à la compréhension du mandat, du champ d’intervention et du cadre d’action de l’institution.</p>
     <p>Cette organisation documentaire s’inscrit dans une logique de clarté, de traçabilité et de diffusion de l’information institutionnelle.</p>`;

  const featuredPublications = useMemo(() => {
    return (publications || []).slice(0, 6);
  }, [publications]);

  return (
    <>
      {usePageMeta({ title, description: summary })}

      <PageBanner
        title={title}
        subtitle={summary}
        badge="Publications"
        light
        backgroundImage="/images/sections/snrc.png"
      />

      <section className="section-snrc bg-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
              Documentation institutionnelle
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              {loadingPage ? "Chargement..." : title}
            </h2>

            <RichContent content={content} className="mt-4" />

            <div className="mt-8">
              <Link to="/services" className="btn-snrc-secondary">
                Voir les domaines d’intervention
              </Link>
            </div>
          </div>

          <div className="card-snrc overflow-hidden rounded-[1.75rem]">
            <img
              src={page?.banner_image || "/images/sections/snrc.png"}
              alt={title}
              className="h-96 w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Container>
      </section>

      <section className="section-snrc bg-snrc-light">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
              Repères
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              Une bibliothèque documentaire institutionnelle
            </h2>

            <p className="mt-4 text-base leading-7 text-snrc-blue/85 sm:text-lg">
              Les publications de la SNRC participent à la diffusion des informations
              officielles, à la lisibilité institutionnelle et à l’accès à la documentation utile.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="card-snrc p-6">
                  <div className="inline-flex rounded-2xl bg-snrc-blue/10 p-3 text-snrc-blue">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-bold text-snrc-blue">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-snrc-blue/80">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section-snrc bg-white">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-snrc-red/10 px-3 py-1 text-sm font-semibold text-snrc-red">
                Documents
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
                Publications disponibles
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-7 text-snrc-blue/85 sm:text-lg">
                Consultez les documents institutionnels publiés par la SNRC.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-semibold text-snrc-blue"
            >
              Demander une information <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5">
            {loadingPublications ? (
              <p className="text-snrc-blue/80">Chargement des publications...</p>
            ) : featuredPublications.length === 0 ? (
              <p className="text-snrc-blue/80">Aucune publication disponible.</p>
            ) : (
              featuredPublications.map((item) => (
                <article
                  key={item.id}
                  className="card-snrc flex flex-col gap-4 overflow-hidden p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-1 items-start gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                      <img
                        src={
                          resolveMediaUrl(item.cover_image) ||
                          "/images/publications/publication-1.png"
                        }
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-snrc-red/10 p-2.5 text-snrc-red">
                          <FileText size={20} />
                        </div>
                        <p className="text-sm font-medium text-snrc-blue/70">
                          {item.category_name || "Publication"} • {formatDate(item.published_at)}
                        </p>
                      </div>

                      <h3 className="mt-3 font-display text-lg font-bold text-snrc-blue">
                        {item.title}
                      </h3>

                      {item.description ? (
                        <p className="mt-2 leading-7 text-snrc-blue/80">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {item.file_url ? (
                      <a
                        href={resolveMediaUrl(item.file_url) || item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-snrc-primary inline-flex items-center gap-2"
                      >
                        <Download size={18} />
                        Consulter
                      </a>
                    ) : (
                      <span className="btn-snrc-outline">Indisponible</span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </Container>
      </section>

      <section className="section-snrc bg-snrc-light">
        <Container>
          <div className="card-snrc grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
                Aller plus loin
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
                Consultez aussi les actualités et les missions de la SNRC
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-snrc-blue/85">
                Poursuivez votre navigation pour découvrir les actualités officielles,
                les missions institutionnelles et le champ d’intervention de la SNRC.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/actualites" className="btn-snrc-primary">
                Voir les actualités
              </Link>
              <Link to="/missions" className="btn-snrc-outline">
                Voir les missions
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}