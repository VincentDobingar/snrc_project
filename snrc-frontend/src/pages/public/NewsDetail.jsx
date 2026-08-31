import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getNewsBySlug } from "../../api/newsApi";
import usePageMeta from "../../hooks/usePageMeta";
import { resolveMediaUrl, formatDate } from "../../utils/media";

export default function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loadedSlug, setLoadedSlug] = useState(null);
  const loading = loadedSlug !== slug;

  useEffect(() => {
    let cancelled = false;

    getNewsBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
          setNews(null);
        } else {
          setNotFound(false);
          setNews(data);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
        setNews(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadedSlug(slug);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pageMeta = usePageMeta(
    loading
      ? { title: "Chargement..." }
      : notFound || !news
      ? { title: "Actualité introuvable", noindex: true }
      : {
          title: news.title,
          description: news.summary,
          image: resolveMediaUrl(news.featured_image),
        }
  );

  if (loading) {
    return (
      <section className="section-snrc bg-white">
        {pageMeta}
        <Container>
          <p className="text-snrc-blue/80">Chargement de l’actualité...</p>
        </Container>
      </section>
    );
  }

  if (notFound || !news) {
    return (
      <section className="section-snrc bg-white">
        {pageMeta}
        <Container className="text-center">
          <h1 className="font-display text-3xl font-bold text-snrc-blue">
            Actualité introuvable
          </h1>
          <p className="mt-4 text-snrc-blue/80">
            Cette actualité n’existe pas ou n’est plus disponible.
          </p>
          <Link to="/actualites" className="btn-snrc-primary mt-8 inline-flex">
            <ArrowLeft size={18} />
            Retour aux actualités
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <>
      {pageMeta}

      <PageBanner
        title={news.title}
        subtitle={news.summary}
        badge="Actualité"
        backgroundImage="/images/sections/snrc.jpg"
      />

      <section className="section-snrc bg-white">
        <Container className="max-w-4xl">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 font-semibold text-snrc-blue"
          >
            <ArrowLeft size={18} />
            Retour aux actualités
          </Link>

          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-snrc-red">
            <Calendar size={16} />
            {formatDate(news.published_at)}
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
            {news.title}
          </h2>

          {news.featured_image ? (
            <div className="mt-8 overflow-hidden rounded-[1.75rem]">
              <img
                src={resolveMediaUrl(news.featured_image)}
                alt={news.title}
                className="h-96 w-full object-cover"
              />
            </div>
          ) : null}

          <RichContent content={news.content} className="mt-8" />
        </Container>
      </section>
    </>
  );
}
