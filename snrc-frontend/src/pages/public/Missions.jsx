import { useEffect, useState } from "react";
import { ArrowRight, FileText, Landmark, Newspaper, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getPageBySlug } from "../../api/pagesApi";
import usePageMeta from "../../hooks/usePageMeta";

const missionCards = [
  {
    title: "Recouvrement des créances en difficulté",
    text: "Recouvrement contre rémunération des créances douteuses, litigieuses et/ou contentieuses détenues par les institutions financières publiques et privées.",
    icon: Landmark,
  },
  {
    title: "Liquidation amiable d’établissements de crédit",
    text: "Liquidation de tout ou partie des actifs et du passif d’un établissement de crédit confiée par l’autorité compétente, la COBAC ou les tribunaux.",
    icon: Shield,
  },
  {
    title: "Gestion des créances confiées par l’État",
    text: "Gestion des créances confiées par l’État, qu’elles soient bancaires, parapubliques, privées ou issues d’entreprises non financières du secteur public.",
    icon: Newspaper,
  },
  {
    title: "Opérations connexes à l’objet social",
    text: "Participation directe ou indirecte à des activités ou opérations commerciales, financières ou mobilières rattachées à l’objet social de la SNRC.",
    icon: FileText,
  },
];

export default function Missions() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPageBySlug("missions")
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, []);

  const title = page?.title || "Missions";
  const summary =
    page?.summary ||
    "La SNRC contribue à l’assainissement du système financier national à travers le recouvrement effectif des créances en difficulté.";

  const content =
    page?.content ||
    `<p>La Société Nationale de Recouvrement des Créances (SNRC) a pour mission de contribuer à l’assainissement du système financier national à travers le recouvrement effectif des créances en difficulté.</p>
     <p>Ses interventions s’exercent dans le respect du cadre juridique et réglementaire en vigueur, notamment en matière de transfert de créances, de gestion des actifs et de protection des droits des établissements financiers et des débiteurs.</p>`;

  return (
    <>
      {usePageMeta({ title, description: summary })}

      <PageBanner
        title={title}
        subtitle={summary}
        badge="Missions"
        backgroundImage="/images/sections/snrc.jpg"
      />

      <section className="section-snrc bg-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
              Mission institutionnelle
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              {loading ? "Chargement..." : title}
            </h2>

            <RichContent content={content} className="mt-4" />
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
            <h2 className="font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              Champ d’intervention de la SNRC
            </h2>

            <p className="mt-4 text-base leading-7 text-snrc-blue/85 sm:text-lg">
              La SNRC intervient sur plusieurs volets stratégiques liés au recouvrement,
              à la gestion d’actifs et à la stabilisation du système financier.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {missionCards.map((item) => {
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
          <div className="card-snrc grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
                Suite de navigation
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
                Découvrez également les services de la SNRC
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-snrc-blue/85">
                Consultez les services, publications et actualités institutionnelles
                liés aux missions de la SNRC.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 btn-snrc-primary"
            >
              Voir les services <ArrowRight size={18} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}