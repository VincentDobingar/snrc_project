import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Banknote,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Landmark,
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getPageBySlug } from "../../api/pagesApi";
import usePageMeta from "../../hooks/usePageMeta";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const pillars = [
  {
    title: "Mise en place institutionnelle",
    text: "La SNRC a été mise en place dans le cadre d’une réforme visant à renforcer l’assainissement du système financier national.",
    icon: Landmark,
  },
  {
    title: "Mission générale",
    text: "Contribuer à l’assainissement du système financier national à travers le recouvrement effectif des créances en difficulté.",
    icon: ShieldCheck,
  },
  {
    title: "Cadre juridique d’intervention",
    text: "La SNRC agit dans le respect du Décret n°0539/PR/PM/MFBEPCI/2025 portant Statuts de la Société Nationale de Recouvrement des Créances.",
    icon: Scale,
  },
];

const snrcObjectives = [
  {
    title: "Assainir le bilan des banques",
    description:
      "Contribuer à l’assainissement du bilan des banques à travers le traitement professionnel des créances en difficulté.",
    icon: Banknote,
  },
  {
    title: "Renforcer la confiance",
    description:
      "Renforcer la confiance dans le secteur bancaire et financier grâce à des mécanismes structurés de recouvrement.",
    icon: ShieldCheck,
  },
  {
    title: "Favoriser la relance du crédit",
    description:
      "Favoriser la relance du crédit à l’économie en améliorant la qualité des portefeuilles bancaires.",
    icon: TrendingUp,
  },
  {
    title: "Améliorer la gestion des actifs",
    description:
      "Améliorer la gestion des actifs financiers en difficulté par une approche rigoureuse, organisée et suivie.",
    icon: BarChart3,
  },
  {
    title: "Contribuer au développement économique",
    description:
      "Contribuer au développement économique du Tchad par la stabilisation et l’assainissement du système financier.",
    icon: Landmark,
  },
];

const actionPrinciples = [
  {
    title: "Rigueur",
    description: "Des méthodes professionnelles et structurées.",
    icon: Target,
  },
  {
    title: "Transparence",
    description:
      "Des procédures conformes aux cadres réglementaires et aux standards de la COBAC.",
    icon: Eye,
  },
  {
    title: "Résultats",
    description:
      "Des solutions adaptées pour optimiser la gestion et le recouvrement des créances.",
    icon: Award,
  },
];

const legalFacts = [
  {
    title: "Texte de référence",
    value: "Décret n°0539/PR/PM/MFBEPCI/2025",
    text: "Décret portant Statuts de la Société Nationale de Recouvrement des Créances.",
    icon: FileText,
  },
  {
    title: "Forme juridique",
    value: "Société anonyme",
    text: "La SNRC est organisée sous la forme d’une société anonyme avec Conseil d’administration.",
    icon: Building2,
  },
  {
    title: "Tutelle",
    value: "Ministre chargé des Finances",
    text: "La SNRC est placée sous la tutelle technique et financière du Ministre chargé des Finances.",
    icon: Landmark,
  },
  {
    title: "Siège social",
    value: "N’Djamena, Tchad",
    text: "Le siège social de la Société Nationale de Recouvrement des Créances est établi à N’Djamena.",
    icon: Building2,
  },
  {
    title: "Durée statutaire",
    value: "99 ans",
    text: "La société est constituée pour une durée de 99 ans, sauf dissolution anticipée ou prorogation prévue par les statuts.",
    icon: Clock3,
  },
  {
    title: "Gouvernance",
    value: "Organes statutaires",
    text: "La gouvernance repose notamment sur l’Assemblée générale, le Conseil d’administration, la Direction générale et les organes de contrôle.",
    icon: UsersRound,
  },
];

export default function About() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPageBySlug("la-snrc")
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, []);

  const title = page?.title || "La SNRC";

  const summary =
    page?.summary ||
    "La SNRC est une institution mise en place pour contribuer à l’assainissement du système financier national à travers le recouvrement effectif des créances en difficulté.";

  const content =
    page?.content ||
    `<p>La Société Nationale de Recouvrement des Créances (SNRC) a été mise en place dans le cadre d’une réforme orientée vers l’assainissement du système financier national.</p>
     <p>Disposant du privilège du trésor et de l’hypothèque légale sur les immeubles, elle a pour mission de contribuer au recouvrement effectif des créances en difficulté et d’intervenir dans un champ d’action institutionnel clairement défini.</p>
     <p>Ses interventions s’exercent dans le respect du cadre juridique et réglementaire en vigueur, notamment en matière de transfert de créances, de gestion des actifs et de protection des droits des établissements financiers et des débiteurs.</p>`;

  const legalContent = `
    <p>
      La Société Nationale de Recouvrement des Créances, en abrégé <strong>SNRC</strong>,
      est encadrée par le <strong>Décret n°0539/PR/PM/MFBEPCI/2025 portant Statuts de la Société
      Nationale de Recouvrement des Créances</strong>, signé à N’Djamena le 02 avril 2025.
    </p>

    <p>
      Ce texte fixe le cadre juridique, l’organisation, les missions, la gouvernance,
      les ressources et les modalités de fonctionnement de la SNRC. Il confirme notamment
      que la SNRC est une société nationale organisée sous la forme d’une société anonyme
      avec Conseil d’administration, dotée de la personnalité morale et de l’autonomie financière.
    </p>

    <p>
      Conformément à ses statuts, la SNRC intervient dans le recouvrement des créances
      douteuses, litigieuses ou contentieuses, la gestion des créances confiées par l’État,
      la liquidation amiable d’actifs ou de passifs d’établissements de crédit, ainsi que
      les opérations connexes à son objet social.
    </p>
  `;

  return (
    <>
      {usePageMeta({ title, description: summary })}

      <PageBanner
        title={title}
        subtitle={summary}
        badge="Présentation"
        light
        backgroundImage="/images/sections/snrc.jpg"
      />

      {/* PRÉSENTATION */}
      <section className="section-snrc bg-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
              Institution
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              {loading ? "Chargement..." : title}
            </h2>

            <RichContent content={content} className="mt-4" />

            <div className="mt-8">
              <Link to="/missions" className="btn-snrc-secondary">
                Découvrir les missions
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

      {/* NOS OBJECTIFS */}
      <section className="relative overflow-hidden bg-[#2f4697] py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(15,23,42,0.28),transparent_35%)]" />

        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <Container className="relative z-10">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <span className="inline-flex rounded-xl bg-snrc-gold px-5 py-2 font-display text-2xl font-black text-[#2f4697] shadow-xl shadow-black/20 sm:text-3xl">
                Nos Objectifs
              </span>

              <h2 className="mt-8 max-w-4xl font-display text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Des objectifs stratégiques au service de l’assainissement financier.
              </h2>

              <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-blue-50 sm:text-lg">
                À travers ses activités, la SNRC poursuit plusieurs objectifs
                stratégiques visant à renforcer la stabilité du système bancaire,
                améliorer le traitement des créances et soutenir le développement
                économique du Tchad.
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="mt-9 space-y-4"
              >
                {snrcObjectives.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.article
                      key={item.title}
                      variants={fadeUp}
                      className="group flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-snrc-gold text-[#2f4697] shadow-lg">
                        <Icon size={23} />
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-black text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-blue-50">
                          {item.description}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2.5rem] bg-snrc-gold/30 blur-xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-blue-950 to-[#2f4697] p-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[#2f4697] shadow-2xl">
                    <Target size={42} />
                  </div>

                  <h3 className="mt-8 font-display text-3xl font-black text-white">
                    Vision orientée impact
                  </h3>

                  <p className="mt-4 text-base leading-8 text-blue-50">
                    La SNRC agit comme un levier institutionnel pour réduire les
                    créances en difficulté, restaurer la confiance et contribuer à
                    un environnement financier plus sain.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {["Stabilité", "Confiance", "Relance", "Développement"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur"
                        >
                          <p className="font-display text-lg font-black text-white">
                            {item}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* NOS PRINCIPES D’ACTION */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-snrc-light to-white" />

        <Container className="relative z-10">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <span className="inline-flex rounded-xl bg-snrc-gold px-5 py-2 font-display text-2xl font-black text-[#2f4697] shadow-xl shadow-snrc-gold/30 sm:text-3xl">
                Nos principes d’action
              </span>

              <h2 className="mt-8 max-w-4xl font-display text-3xl font-black leading-tight text-snrc-blue sm:text-4xl lg:text-5xl">
                Une action fondée sur la rigueur, la transparence et les résultats.
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-snrc-blue/75 sm:text-lg">
                La SNRC fonde son intervention sur des principes opérationnels
                clairs, garantissant une gestion professionnelle, conforme et
                orientée vers l’efficacité du recouvrement.
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="mt-10 grid gap-5"
              >
                {actionPrinciples.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.article
                      key={item.title}
                      variants={fadeUp}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-snrc-blue/10 bg-white p-6 shadow-soft transition hover:-translate-y-2 hover:border-snrc-gold/40 hover:shadow-2xl"
                    >
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-snrc-blue/5 transition group-hover:bg-snrc-gold/10" />

                      <div className="relative z-10 flex gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-snrc-blue text-white shadow-lg">
                          <Icon size={26} />
                        </div>

                        <div>
                          <h3 className="font-display text-2xl font-black uppercase text-snrc-blue">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-base leading-7 text-snrc-blue/75">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2.5rem] bg-snrc-gold/25 blur-xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-snrc-blue/10 bg-white p-4 shadow-2xl">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-snrc-blue via-[#243f91] to-slate-950 p-8 text-white">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[#2f4697] shadow-2xl">
                    <CheckCircle2 size={42} />
                  </div>

                  <h3 className="mt-8 font-display text-3xl font-black">
                    Méthode professionnelle
                  </h3>

                  <p className="mt-4 text-base leading-8 text-blue-50">
                    Chaque intervention repose sur des procédures structurées,
                    une transparence conforme aux exigences réglementaires et une
                    recherche permanente de résultats mesurables.
                  </p>

                  <div className="mt-8 space-y-4">
                    {["Rigueur", "Transparence", "Efficacité"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                      >
                        <CheckCircle2 size={20} className="text-snrc-gold" />
                        <p className="font-display text-lg font-black">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CADRE JURIDIQUE */}
      <section className="section-snrc bg-snrc-light">
        <Container>
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
              Cadre juridique
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              Un cadre légal défini par le décret portant statuts de la SNRC
            </h2>

            <RichContent content={legalContent} className="mt-5" />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {legalFacts.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="card-snrc p-6">
                  <div className="inline-flex rounded-2xl bg-snrc-blue/10 p-3 text-snrc-blue">
                    <Icon size={24} />
                  </div>

                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-snrc-blue/60">
                    {item.title}
                  </p>

                  <h3 className="mt-2 font-display text-xl font-bold text-snrc-blue">
                    {item.value}
                  </h3>

                  <p className="mt-3 leading-7 text-snrc-blue/80">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-snrc-blue/10 bg-white p-6 shadow-soft lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h3 className="font-display text-2xl font-bold text-snrc-blue">
                  Document officiel de référence
                </h3>

                <p className="mt-3 max-w-3xl leading-7 text-snrc-blue/80">
                  Le décret portant statuts de la SNRC peut être consulté dans la
                  rubrique Publications afin de permettre au public, aux partenaires
                  et aux parties prenantes d’accéder au cadre juridique officiel de
                  l’institution.
                </p>
              </div>

              <Link
                to="/publications"
                className="inline-flex items-center justify-center gap-2 btn-snrc-primary"
              >
                Consulter le décret <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* FONDEMENTS */}
      <section className="section-snrc bg-white">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
              Fondements
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              Une institution au service de l’assainissement financier
            </h2>

            <p className="mt-4 text-base leading-7 text-snrc-blue/85 sm:text-lg">
              La SNRC s’inscrit dans une logique de réforme, de stabilité
              financière et de sécurisation du traitement des créances en difficulté.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map((item) => {
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

      {/* CTA SERVICES */}
      <section className="section-snrc bg-white">
        <Container>
          <div className="card-snrc grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex rounded-full bg-snrc-red/10 px-3 py-1 text-sm font-semibold text-snrc-red">
                En savoir plus
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
                Explorez aussi les domaines d’intervention de la SNRC
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-snrc-blue/85">
                Consultez la page Services pour découvrir plus en détail le champ
                d’intervention institutionnel de la SNRC.
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