import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Landmark,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getPageBySlug } from "../../api/pagesApi";
import usePageMeta from "../../hooks/usePageMeta";

const serviceCards = [
  {
    title: "Recouvrement des créances en difficulté",
    text: "Recouvrement contre rémunération des créances douteuses, litigieuses et/ou contentieuses détenues par les institutions financières publiques et privées.",
    icon: Landmark,
  },
  {
    title: "Liquidation amiable d’établissements de crédit",
    text: "Liquidation de tout ou partie des actifs et du passif d’un établissement de crédit confiée par l’autorité de tutelle, la COBAC ou les tribunaux.",
    icon: Scale,
  },
  {
    title: "Gestion des créances confiées par l’État",
    text: "Gestion de toute créance confiée par l’État, qu’elle soit bancaire ou issue d’une entité financière ou non, du secteur parapublic, privé ou d’une entreprise non financière publique.",
    icon: FileText,
  },
  {
    title: "Opérations connexes à l’objet social",
    text: "Participation directe ou indirecte à des activités ou opérations commerciales, financières ou mobilières rattachées directement ou indirectement à l’objet social de la SNRC.",
    icon: Briefcase,
  },
];

export default function Services() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPageBySlug("services")
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, []);

  const title = page?.title || "Services et domaines d’intervention";
  const summary =
    page?.summary ||
    "La SNRC intervient dans le recouvrement des créances en difficulté, la liquidation amiable d’établissements de crédit, la gestion de créances confiées par l’État et les opérations connexes à son objet social.";

  const content =
    page?.content ||
    `<p>La Société Nationale de Recouvrement des Créances (SNRC) intervient dans un cadre institutionnel précis en vue de contribuer à l’assainissement du système financier national.</p>
     <p>Son action couvre notamment le recouvrement des créances en difficulté, la liquidation amiable d’établissements de crédit, la gestion de créances confiées par l’État ainsi que des opérations connexes à son objet social.</p>
     <p>Ces interventions s’exercent dans le respect du cadre juridique et réglementaire en vigueur, notamment en matière de transfert de créances, de gestion des actifs et de protection des droits des établissements financiers et des débiteurs.</p>`;

  return (
    <>
      {usePageMeta({ title, description: summary })}

      <PageBanner
        title={title}
        subtitle={summary}
        badge="Domaines d’intervention"
        light
        backgroundImage="/images/sections/snrc.jpg"
      />

      <section className="section-snrc bg-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
              Champ d’intervention
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              {loading ? "Chargement..." : title}
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
              Interventions
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              Principaux domaines d’action de la SNRC
            </h2>

            <p className="mt-4 text-base leading-7 text-snrc-blue/85 sm:text-lg">
              Une action encadrée, institutionnelle et orientée vers
              l’assainissement du système financier national.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {serviceCards.map((item) => {
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
              <span className="inline-flex rounded-full bg-snrc-red/10 px-3 py-1 text-sm font-semibold text-snrc-red">
                Aller plus loin
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
                Découvrez aussi les missions de la SNRC
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-snrc-blue/85">
                Consultez la page Missions pour comprendre le mandat
                institutionnel global de la SNRC et son rôle dans
                l’assainissement du système financier national.
              </p>
            </div>

            <Link
              to="/missions"
              className="inline-flex items-center gap-2 btn-snrc-primary"
            >
              Voir les missions <ArrowRight size={18} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}