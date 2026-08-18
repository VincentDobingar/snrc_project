import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  Handshake,
  Landmark,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";

/* -------------------------------------------------------
   Composant local pour éviter l’erreur d’import "@/..."
------------------------------------------------------- */
function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------
   Animations
------------------------------------------------------- */
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

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`mb-12 max-w-3xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <Sparkles size={16} />
          {eyebrow}
        </div>
      )}

      <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------
   Données de la page
------------------------------------------------------- */
const heroSlides = [
  {
    image: "/images/sections/snrc.png",
    badge: "Institution publique • République du Tchad",
    title: "Société Nationale de Recouvrement des Créances",
    subtitle:
      "Un acteur institutionnel engagé pour le recouvrement, la transparence financière et la consolidation des créances publiques et parapubliques.",
  },
  {
    image: "/images/sections/snrc-building.jpg",
    badge: "Recouvrement • Gouvernance • Performance",
    title: "Une institution au service de la souveraineté financière",
    subtitle:
      "La SNRC accompagne l’État, les institutions publiques et les partenaires dans la sécurisation et la valorisation des créances.",
  },
  {
    image: "/images/sections/administration-publique.jpg",
    badge: "Modernisation • Suivi • Redevabilité",
    title: "Une approche moderne du recouvrement institutionnel",
    subtitle:
      "Des outils, des procédures et une gouvernance orientés résultats pour renforcer l’efficacité du recouvrement.",
  },
];

const stats = [
  {
    value: "01",
    label: "Institution nationale spécialisée",
    icon: Landmark,
  },
  {
    value: "360°",
    label: "Suivi des créances et dossiers",
    icon: BarChart3,
  },
  {
    value: "100%",
    label: "Orientation transparence et conformité",
    icon: ShieldCheck,
  },
  {
    value: "24/7",
    label: "Information institutionnelle accessible",
    icon: Globe2,
  },
];

const missionCards = [
  {
    icon: Banknote,
    title: "Recouvrement des créances",
    description:
      "Mettre en œuvre les mécanismes adaptés pour identifier, suivre et recouvrer les créances confiées à l’institution.",
  },
  {
    icon: Scale,
    title: "Sécurisation juridique",
    description:
      "Accompagner les processus de recouvrement dans un cadre légal, structuré, traçable et conforme.",
  },
  {
    icon: BarChart3,
    title: "Suivi et reporting",
    description:
      "Produire des analyses fiables, des indicateurs et des rapports pour éclairer la décision institutionnelle.",
  },
  {
    icon: Handshake,
    title: "Coordination institutionnelle",
    description:
      "Collaborer avec les administrations, partenaires et structures concernées pour renforcer l’efficacité collective.",
  },
];

const services = [
  "Identification et analyse des créances",
  "Suivi administratif et financier des dossiers",
  "Appui aux procédures de recouvrement",
  "Production de rapports institutionnels",
  "Coordination avec les partenaires publics",
  "Veille, conformité et amélioration continue",
];

const governanceItems = [
  {
    title: "Transparence",
    description:
      "Une démarche fondée sur la traçabilité, la redevabilité et la fiabilité de l’information.",
  },
  {
    title: "Performance",
    description:
      "Des indicateurs de suivi pour mesurer les résultats et améliorer les actions de recouvrement.",
  },
  {
    title: "Conformité",
    description:
      "Des actions alignées sur le cadre légal, administratif et institutionnel en vigueur.",
  },
];

const governanceStructure = [
  {
    icon: Landmark,
    title: "Tutelle",
    detail:
      "Ministre des Finances, du Budget, de l’Economie, du Plan et de la Coopération Internationale",
    name: "M. Tahir Hamid Nguilin",
  },
  {
    icon: ShieldCheck,
    title: "Régulateur",
    detail: "Commission Bancaire de l’Afrique Centrale",
    name: "COBAC",
  },
  {
    icon: Globe2,
    title: "Zone Monétaire",
    detail: "CEMAC — Banque des États de l’Afrique Centrale",
    name: "BEAC",
  },
  {
    icon: Scale,
    title: "Gouvernance",
    detail: "Conseil d’Administration, code d’éthique et Direction Générale",
    name: "Cadre institutionnel",
  },
  {
    icon: Users,
    title: "Directrice Générale",
    detail: "Direction Générale de la SNRC",
    name: "Mme Ramada Abderahim Ndiaye",
  },
  {
    icon: Building2,
    title: "Directeur Général Adjoint",
    detail: "Direction Générale Adjointe de la SNRC",
    name: "M. Sougnabe Oualoumi",
  },
];

const whySnrcStats = [
  {
    value: "42,8 %",
    title: "Créances douteuses / crédits bruts",
    description:
      "Taux de créances non performantes du secteur bancaire tchadien à fin 2025.",
    source: "BEAC",
    icon: BarChart3,
  },
  {
    value: "2 757 MDS",
    title: "Bilan agrégé des banques",
    description:
      "Le bilan agrégé des banques à fin décembre 2025 se situe à 2 757,7 milliards de FCFA, en progression de 3,4 % sur un an.",
    source: "BEAC",
    icon: Banknote,
  },
  {
    value: "> 17 %",
    title: "Créances en souffrance CEMAC",
    description:
      "Selon la COBAC, le taux des créances en souffrance dans la zone CEMAC dépasse 17 % des crédits bruts à fin mars 2025.",
    source: "COBAC — Juin 2025",
    icon: ShieldCheck,
  },
];

const newsItems = [
  {
    category: "Institution",
    title: "Renforcement du dispositif national de recouvrement",
    description:
      "La SNRC poursuit sa dynamique de modernisation afin d’améliorer la gestion et le suivi des créances.",
    link: "/actualites",
  },
  {
    category: "Publication",
    title: "Informations publiques et ressources institutionnelles",
    description:
      "Retrouvez les documents, publications et informations utiles mis à disposition par l’institution.",
    link: "/publications",
  },
  {
    category: "Partenariat",
    title: "Collaboration avec les institutions partenaires",
    description:
      "La SNRC s’inscrit dans une logique de coopération avec les acteurs publics et techniques.",
    link: "/missions",
  },
];

const CHAD_EMBLEM = "/images/brand/armoirie-tchad.png";

/* -------------------------------------------------------
   Page Home
------------------------------------------------------- */
export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [dgImageOk, setDgImageOk] = useState(true);
  const [emblemOk, setEmblemOk] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = useMemo(() => heroSlides[activeSlide], [activeSlide]);

  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {usePageMeta({
        description:
          "SNRC, Société Nationale de Recouvrement des Créances : institution nationale tchadienne au service de la mobilisation, de la sécurisation et de la valorisation des créances publiques.",
      })}

      {/* HERO PREMIUM */}
      <section className="relative min-h-[88vh] overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.72), rgba(30, 64, 175, 0.35)), url(${currentSlide.image})`,
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.18),transparent_32%)]" />

        <div className="absolute left-0 top-0 h-full w-full opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {emblemOk && (
          <div className="pointer-events-none absolute right-[-40px] top-20 z-[1] hidden opacity-[0.08] lg:block">
            <img
              src={CHAD_EMBLEM}
              alt=""
              className="h-[420px] w-[420px] object-contain"
              onError={() => setEmblemOk(false)}
            />
          </div>
        )}

        <Container className="relative z-10 flex min-h-[88vh] items-center py-24">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl"
            >
              <motion.div
                variants={fadeUp}
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-2xl backdrop-blur-md"
              >
                {emblemOk ? (
                  <img
                    src={CHAD_EMBLEM}
                    alt="Armoirie de la République du Tchad"
                    className="h-8 w-8 rounded-full bg-white p-1 object-contain shadow-md"
                    onError={() => setEmblemOk(false)}
                  />
                ) : (
                  <BadgeCheck size={17} className="text-blue-200" />
                )}

                <span>{currentSlide.badge}</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
              >
                {currentSlide.title}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-3xl text-lg leading-8 text-blue-50 sm:text-xl"
              >
                {currentSlide.subtitle}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-7 flex max-w-2xl items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md"
              >
                {emblemOk && (
                  <img
                    src={CHAD_EMBLEM}
                    alt="Armoirie de la République du Tchad"
                    className="h-14 w-14 shrink-0 rounded-2xl bg-white p-2 object-contain shadow-lg"
                    onError={() => setEmblemOk(false)}
                  />
                )}

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-200">
                    République du Tchad
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-blue-50">
                    Une institution nationale au service de la mobilisation, de
                    la sécurisation et de la valorisation des créances publiques.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  to="/missions"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-2xl shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Découvrir nos missions
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Contacter la SNRC
                  <Phone size={18} />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap gap-3 text-sm text-blue-50"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                  <ShieldCheck size={16} />
                  Gouvernance
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                  <Scale size={16} />
                  Conformité
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                  <BarChart3 size={16} />
                  Performance
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="hidden lg:block"
            >
              <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/30 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />

                <div className="relative rounded-[1.5rem] bg-white p-6 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                        Tableau institutionnel
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-slate-950">
                        Pilotage des créances
                      </h3>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 p-2 text-blue-700 shadow-sm">
                      {emblemOk ? (
                        <img
                          src={CHAD_EMBLEM}
                          alt="Armoirie du Tchad"
                          className="h-full w-full object-contain"
                          onError={() => setEmblemOk(false)}
                        />
                      ) : (
                        <Building2 size={28} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      ["Identification", "Créances recensées et analysées"],
                      ["Suivi", "Dossiers structurés et priorisés"],
                      ["Action", "Procédures engagées et contrôlées"],
                      ["Reporting", "Indicateurs et résultats consolidés"],
                    ].map(([title, desc], index) => (
                      <div
                        key={title}
                        className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-950">
                            {title}
                          </h4>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-700 to-slate-900 p-5 text-white">
                    <p className="text-sm font-semibold text-blue-100">
                      Objectif
                    </p>
                    <p className="mt-2 text-lg font-black">
                      Renforcer la mobilisation et la sécurisation des ressources.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeSlide === index
                  ? "w-10 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <section className="relative -mt-16 z-20">
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-5 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  className="rounded-[1.5rem] bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl font-black text-slate-950">
                    {item.value}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* POURQUOI CRÉER LA SNRC MAINTENANT */}
      <section className="relative overflow-hidden bg-[#2f4697] py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_85%_60%,rgba(15,23,42,0.22),transparent_35%)]" />

        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-blue-50 backdrop-blur">
              <BarChart3 size={16} />
              Contexte stratégique
            </div>

            <h2 className="max-w-5xl text-3xl font-black uppercase leading-tight tracking-[0.16em] text-white sm:text-4xl lg:text-5xl">
              Pourquoi créer la SNRC maintenant ?
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-8 lg:grid-cols-3"
          >
            {whySnrcStats.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white p-6 text-slate-950 shadow-2xl shadow-slate-950/20 transition duration-300 group-hover:-translate-y-2">
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-blue-50 transition group-hover:bg-yellow-50" />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-4xl font-black leading-none tracking-wide text-black sm:text-5xl">
                          {item.value}
                        </div>

                        <h3 className="mt-4 text-base font-black uppercase leading-6 tracking-[0.16em] text-black">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2f4697] text-white shadow-lg shadow-blue-950/20">
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition group-hover:bg-white/10">
                    <p className="text-base font-medium leading-8 text-blue-50 sm:text-lg">
                      {item.description}
                    </p>

                    <div className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
                      Source : {item.source}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* PRÉSENTATION */}
      <section className="py-24">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -left-6 -top-6 h-36 w-36 rounded-full bg-blue-100 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-cyan-100 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-100 shadow-2xl">
                <img
                  src="/images/sections/snrc3.png"
                  alt="Bâtiment institutionnel SNRC"
                  className="h-[520px] w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                    <Landmark size={16} />
                    Institution publique
                  </div>
                  <h3 className="text-3xl font-black">
                    Une mission nationale de recouvrement et de valorisation.
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">
                <Building2 size={16} />
                Présentation
              </div>

              <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                Une institution stratégique pour le recouvrement des créances.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                La Société Nationale de Recouvrement des Créances accompagne les
                pouvoirs publics dans la gestion, le suivi et le recouvrement des
                créances. Elle contribue à renforcer la discipline financière,
                la redevabilité et la mobilisation des ressources.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Gestion structurée des dossiers",
                  "Suivi institutionnel renforcé",
                  "Coordination avec les parties prenantes",
                  "Transparence dans les procédures",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <CheckCircle2 className="text-blue-700" size={21} />
                    <span className="text-sm font-bold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/la-snrc"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  En savoir plus
                  <ChevronRight size={18} />
                </Link>

                <Link
                  to="/publications"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-7 py-4 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                >
                  Voir les publications
                  <FileText size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* DISCOURS DG */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.35),transparent_30%),radial-gradient(circle_at_90%_50%,rgba(14,165,233,0.18),transparent_30%)]" />

        <Container className="relative z-10">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-blue-500/30 to-cyan-300/10 blur-xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-[1.5rem] bg-slate-800">
                  {dgImageOk ? (
                    <img
                      src="/images/direction/dg-snrc.jpg"
                      alt="Directrice Générale de la SNRC"
                      className="h-[560px] w-full object-cover"
                      loading="lazy"
                      onError={() => setDgImageOk(false)}
                    />
                  ) : (
                    <div className="flex h-[560px] w-full flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-950 p-8 text-center">
                      <Users size={72} className="mb-6 text-blue-200" />
                      <h3 className="text-2xl font-black">
                        Espace photo DG
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
                        Ajoute l’image de la Directrice Générale ici :
                        <br />
                        <span className="font-bold">
                          /public/images/direction/dg-snrc.jpg
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/15 bg-slate-950/70 p-5 backdrop-blur-md">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
                    Directrice Générale
                  </p>
                  <h3 className="mt-2 text-2xl font-black">
                    Mme Ramada ABDERAHIM NDIAYE
                  </h3>
                </div>  
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100 backdrop-blur">
                <Megaphone size={16} />
                Mot de la Direction Générale
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                Un engagement constant pour une institution performante,
                transparente et orientée résultats.
              </h2>

              <div className="mt-8 space-y-5 text-lg leading-9 text-blue-50">
                <p>
                  La Société Nationale de Recouvrement des Créances s’inscrit
                  dans une dynamique de modernisation, de rigueur et de
                  responsabilité. Notre mission est de contribuer efficacement à
                  la mobilisation des ressources à travers un recouvrement
                  structuré, transparent et conforme aux exigences
                  institutionnelles.
                </p>

                <p>
                  Nous plaçons la performance, la redevabilité et la coopération
                  au cœur de notre action. Grâce à l’engagement des équipes, à
                  l’amélioration continue de nos procédures et au renforcement
                  de nos outils de suivi, la SNRC entend jouer pleinement son
                  rôle au service de l’État et de l’intérêt général.
                </p>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <p className="text-xl font-black">
                  « Recouvrer avec rigueur, servir avec responsabilité,
                  moderniser avec vision. »
                </p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Directrice Générale de la SNRC
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* MISSIONS */}
      <section className="bg-slate-50 py-24">
        <Container>
          <SectionHeader
            eyebrow="Nos missions"
            title="Des missions structurées autour du recouvrement et de la performance publique."
            description="La SNRC intervient dans un cadre institutionnel exigeant, avec une approche fondée sur l’analyse, la coordination, la conformité et le suivi des résultats."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {missionCards.map((card) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  className="group rounded-[1.75rem] border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-950/10"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="text-xl font-black text-slate-950">
                    {card.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* SERVICES */}
      <section className="py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">
                <ShieldCheck size={16} />
                Domaines d’intervention
              </div>

              <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                Un dispositif opérationnel au service des institutions.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                La SNRC agit avec méthode et professionnalisme afin de renforcer
                le traitement, le suivi et la valorisation des créances confiées.
              </p>

              <Link
                to="/services"
                className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Voir nos services
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service}
                  variants={fadeUp}
                  className="flex items-start gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <p className="font-bold leading-7 text-slate-700">
                    {service}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* GOUVERNANCE - PLAQUETTE + CARTES */}
      <section className="relative overflow-hidden bg-[#263f91] py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(15,23,42,0.22),transparent_32%)]" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-5xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-blue-50 backdrop-blur">
              <ShieldCheck size={16} />
              Gouvernance institutionnelle
            </div>

            <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
              Une gouvernance structurée, conforme et orientée performance.
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-blue-50 sm:text-lg">
              La SNRC évolue dans un cadre institutionnel clair, sous tutelle des
              autorités compétentes, avec une organisation reposant sur la conformité,
              l’éthique et la responsabilité.
            </p>
          </motion.div>


          {/* Cartes professionnelles */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {governanceStructure.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-white p-7 text-slate-900 shadow-2xl shadow-slate-950/20 transition hover:-translate-y-2 hover:shadow-blue-950/30"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-blue-50 transition group-hover:bg-blue-100" />

                  <div className="relative z-10">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#263f91] text-white shadow-lg shadow-blue-950/20">
                        <Icon size={26} />
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-yellow-700">
                        SNRC
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#263f91]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                      {item.detail}
                    </p>

                    <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Référence
                      </p>
                      <p className="mt-2 text-lg font-black leading-7 text-slate-950">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* ACTUALITÉS */}
      <section className="bg-slate-50 py-24">
        <Container>
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              align="left"
              eyebrow="Actualités & publications"
              title="Suivre les informations institutionnelles de la SNRC."
              description="Retrouvez les actualités, publications et ressources mises à disposition du public."
            />

            <Link
              to="/actualites"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
            >
              Toutes les actualités
              <ArrowRight size={17} />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 md:grid-cols-3"
          >
            {newsItems.map((item) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                className="group rounded-[1.8rem] border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-950/10"
              >
                <div className="mb-5 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  {item.category}
                </div>

                <h3 className="text-xl font-black leading-tight text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <Link
                  to={item.link}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-700 transition group-hover:gap-3"
                >
                  Lire plus
                  <ArrowRight size={17} />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* CONTACT CTA */}
      <section className="py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-[2.5rem] bg-slate-950 shadow-2xl"
          >
            <div className="relative grid gap-10 p-8 text-white sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_28%),radial-gradient(circle_at_90%_70%,rgba(14,165,233,0.18),transparent_30%)]" />

              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100">
                  <Mail size={16} />
                  Contact institutionnel
                </div>

                <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                  Besoin d’informations ou d’un accompagnement ?
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">
                  Contactez la SNRC pour toute demande d’information, de
                  documentation ou d’orientation relative à ses missions.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full !bg-white px-7 py-4 text-sm font-black !text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:!bg-blue-50 hover:!text-slate-950"
                  >
                    Nous contacter
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/faq"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Consulter la FAQ
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>

              <div className="relative z-10 grid gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700">
                      <MapPin size={23} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-100">
                        Adresse
                      </p>
                      <p className="font-black">N’Djamena, République du Tchad</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700">
                      <Phone size={23} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-100">
                        Téléphone
                      </p>
                      <p className="font-black">+235 30 56 52 95 </p>
                      <p className="font-black">+235 65 53 73 48</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700">
                      <Mail size={23} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-100">
                        Email
                      </p>
                      <p className="font-black">contact@snrc.td</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}