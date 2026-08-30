import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileText, Landmark, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getPageBySlug } from "../../api/pagesApi";
import { getNews } from "../../api/newsApi";
import usePageMeta from "../../hooks/usePageMeta";

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || "";

function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/images/")) return path;
  return `${uploadsBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(value) {
  if (!value) return "Communication institutionnelle";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Communication institutionnelle";
  return date.toLocaleDateString("fr-FR");
}

const highlights = [
  {
    title: "Vie institutionnelle",
    text: "Diffusion des informations liées à l’activité, à l’organisation et au positionnement institutionnel de la SNRC.",
    icon: Landmark,
  },
  {
    title: "Communiqués et annonces",
    text: "Publication des annonces, notes d’information et communications officielles destinées au public et aux partenaires.",
    icon: Newspaper,
  },
  {
    title: "Références documentaires",
    text: "Mise en relation des actualités avec les publications, notes et documents utiles à la compréhension des sujets abordés.",
    icon: FileText,
  },
];

export default function NewsList() {
  const [page, setPage] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    getPageBySlug("actualites")
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoadingPage(false));
  }, []);

  useEffect(() => {
    getNews()
      .then((data) => setNews(data || []))
      .catch(() => setNews([]))
      .finally(() => setLoadingNews(false));
  }, []);

  const title = page?.title || "Actualités";
  const summary =
    page?.summary ||
    "Retrouvez dans cette rubrique les informations, annonces et communications institutionnelles récentes de la SNRC.";

  const content =
    page?.content ||
    `<p>La rubrique Actualités a vocation à présenter les informations institutionnelles récentes de la SNRC dans un format clair, structuré et accessible.</p>
     <p>Elle permet de suivre les annonces, communications officielles, évolutions organisationnelles et informations utiles liées au mandat et au champ d’intervention de l’institution.</p>
     <p>Cette rubrique s’inscrit dans une logique de transparence, de diffusion maîtrisée de l’information et de lisibilité institutionnelle.</p>`;

  const visibleNews = useMemo(() => {
    return news || [];
  }, [news]);

  return (
    <>
      {usePageMeta({ title, description: summary })}

      <PageBanner
        title={title}
        subtitle={summary}
        badge="Actualités"
        backgroundImage="/images/sections/snrc.jpg"
      />

      <section className="section-snrc bg-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
              Information institutionnelle
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              {loadingPage ? "Chargement..." : title}
            </h2>

            <RichContent content={content} className="mt-4" />

            <div className="mt-8">
              <Link to="/publications" className="btn-snrc-secondary">
                Consulter les publications
              </Link>
            </div>
          </div>

          <div className="card-snrc overflow-hidden rounded-[1.75rem]">
            <img
              src={page?.banner_image || "/images/sections/snrc.jpg"}
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
              Rubrique éditoriale
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              Une actualité sobre, claire et institutionnelle
            </h2>

            <p className="mt-4 text-base leading-7 text-snrc-blue/85 sm:text-lg">
              Les actualités de la SNRC visent à informer sur la vie
              institutionnelle, les communications officielles et les contenus
              utiles au public et aux parties prenantes.
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
                Communications récentes
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
                Dernières actualités
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-7 text-snrc-blue/85 sm:text-lg">
                Consultez les actualités et informations institutionnelles les
                plus récentes de la SNRC.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-semibold text-snrc-blue"
            >
              Demander une information <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {loadingNews ? (
              <p className="text-snrc-blue/80">Chargement des actualités...</p>
            ) : visibleNews.length === 0 ? (
              <p className="text-snrc-blue/80">Aucune actualité disponible.</p>
            ) : (
              visibleNews.map((item) => (
                <article
                  key={item.id}
                  className="card-snrc overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="overflow-hidden">
                    <img
                      src={
                        resolveMediaUrl(item.featured_image) ||
                        "/images/news/news-1.png"
                      }
                      alt={item.title}
                      className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-sm font-medium text-snrc-red">
                      {formatDate(item.published_at)}
                    </span>

                    <h3 className="mt-3 font-display text-xl font-bold text-snrc-blue">
                      {item.title}
                    </h3>

                    {item.summary ? (
                      <p className="mt-3 leading-7 text-snrc-blue/85">
                        {item.summary}
                      </p>
                    ) : null}

                    <Link
                      to={`/actualites/${item.slug}`}
                      className="mt-5 btn-snrc-outline"
                    >
                      Lire la suite
                    </Link>
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
                Consultez aussi les publications et les domaines d’intervention
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-snrc-blue/85">
                Poursuivez votre navigation pour découvrir les publications
                officielles, les missions et le champ d’intervention de la SNRC.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/publications" className="btn-snrc-primary">
                Voir les publications
              </Link>
              <Link to="/services" className="btn-snrc-outline">
                Voir les services
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}