import { useEffect, useMemo, useState } from "react";
import { ChevronDown, FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getFaqs } from "../../api/faqsApi";
import usePageMeta from "../../hooks/usePageMeta";

const officialFaqs = [
  {
    id: "presentation-snrc-1",
    question: "Qu’est-ce que la SNRC ?",
    answer: `
      <p>
        La SNRC est une institution financière spécialisée dans le recouvrement
        de créances. Elle ne collecte pas de dépôts et n’octroie pas de crédits.
        Elle agit comme tiers de confiance entre les établissements bancaires
        (banques commerciales ou parapubliques), les autres sociétés et leurs
        débiteurs, dans le strict respect des normes de la COBAC et du cadre
        réglementaire de la CEMAC.
      </p>
      <p>
        La SNRC est porteuse de contrainte. Elle dispose de pouvoirs étendus et
        d’instruments juridiques, notamment le privilège du Trésor et
        l’hypothèque légale sur les biens immobiliers des débiteurs.
      </p>
    `,
  },
  {
    id: "presentation-snrc-2",
    question: "Pourquoi créer la SNRC maintenant ?",
    answer: `
      <p>
        La création de la SNRC répond à l’accumulation de créances non
        performantes, notamment dans le secteur bancaire, qui fragilise le
        système financier et affecte l’économie dans son ensemble.
      </p>
      <p>
        Les données disponibles font état de 42 % de créances douteuses dans
        les bilans bancaires, d’un taux de bancarisation de 2,85 % et de
        5 banques tchadiennes sur 10 sous-capitalisées. La SNRC apporte une
        réponse structurelle grâce à des outils professionnels conformes aux
        standards de la COBAC.
      </p>
    `,
  },
  {
    id: "presentation-snrc-3",
    question: "Comment confier ses créances à la SNRC ?",
    answer: `
      <p>
        L’établissement partenaire signe une convention de recouvrement,
        transfère ses créances douteuses à la SNRC, puis celle-ci prend en
        charge leur recouvrement, d’abord par voie amiable et, si nécessaire,
        par voie contentieuse.
      </p>
      <p>
        Les fonds recouvrés sont ensuite reversés à l’établissement partenaire,
        accompagnés d’un rapport détaillé.
      </p>
    `,
  },
  {
    id: "presentation-snrc-4",
    question: "La SNRC respecte-t-elle les normes de la COBAC ?",
    answer: `
      <p>
        Oui. La conformité aux normes de la COBAC est un principe fondateur de
        la SNRC. Ses opérations, procédures et rapports respectent les exigences
        de la Commission Bancaire de l’Afrique Centrale ainsi que le cadre
        réglementaire de la CEMAC.
      </p>
      <p>
        Cette conformité constitue une garantie pour les équipes juridiques et
        les commissaires aux comptes des établissements partenaires.
      </p>
    `,
  },
  {
    id: "presentation-snrc-5",
    question: "Qu’est-ce que le privilège du Trésor ?",
    answer: `
      <p>
        Le privilège du Trésor est un droit légal de préférence permettant
        d’être remboursé en priorité sur les autres créanciers lors de la
        liquidation d’un débiteur.
      </p>
      <p>
        Dans le cadre du recouvrement, il constitue un outil important pour
        maximiser les montants recouvrés au bénéfice des établissements
        partenaires.
      </p>
    `,
  },
  {
    id: "presentation-snrc-6",
    question: "Quelles sont les prochaines étapes de la SNRC ?",
    answer: `
      <p>
        Les prochaines étapes comprennent le recrutement et la formation des
        équipes, le déploiement du système d’information multi-comptabilité et
        l’extension des partenariats bancaires.
      </p>
      <p>
        Le premier Conseil d’administration adoptera le plan d’action et le
        budget de démarrage.
      </p>
    `,
  },
  {
    id: "decret-snrc-1",
    question: "Quel texte encadre officiellement la SNRC ?",
    answer: `
      <p>
        La Société Nationale de Recouvrement des Créances est encadrée par le
        <strong>Décret n°0539/PR/PM/MFBEPCI/2025 portant Statuts de la Société
        Nationale de Recouvrement des Créances</strong>, signé à N’Djamena le
        02 avril 2025.
      </p>
    `,
  },
  {
    id: "decret-snrc-2",
    question: "Quelle est la forme juridique de la SNRC ?",
    answer: `
      <p>
        La SNRC est une société nationale organisée sous la forme d’une
        <strong>société anonyme avec Conseil d’administration</strong>. Elle
        dispose de la personnalité morale et de l’autonomie financière.
      </p>
    `,
  },
  {
    id: "decret-snrc-3",
    question: "Sous quelle tutelle est placée la SNRC ?",
    answer: `
      <p>
        La SNRC est placée sous la tutelle technique et financière du
        <strong>Ministre chargé des Finances</strong>.
      </p>
    `,
  },
  {
    id: "decret-snrc-4",
    question: "Quelles sont les principales missions de la SNRC ?",
    answer: `
      <p>
        La SNRC a notamment pour mission le recouvrement des créances douteuses,
        litigieuses ou contentieuses, la gestion des créances confiées par l’État,
        la liquidation amiable d’actifs ou de passifs d’établissements de crédit,
        ainsi que les opérations connexes à son objet social.
      </p>
    `,
  },
  {
    id: "decret-snrc-5",
    question: "La SNRC peut-elle gérer des créances confiées par l’État ?",
    answer: `
      <p>
        Oui. Les statuts prévoient que la SNRC peut gérer toute créance confiée
        par l’État, qu’elle soit bancaire ou non bancaire, notamment dans les
        secteurs public, parapublic ou privé.
      </p>
    `,
  },
  {
    id: "decret-snrc-6",
    question: "La SNRC intervient-elle uniquement auprès des institutions publiques ?",
    answer: `
      <p>
        Non. La SNRC peut intervenir pour des créances détenues par des
        institutions financières publiques ou privées, selon les conditions
        prévues par ses statuts et les textes applicables.
      </p>
    `,
  },
  {
    id: "decret-snrc-7",
    question: "Où se trouve le siège social de la SNRC ?",
    answer: `
      <p>
        Le siège social de la SNRC est établi à <strong>N’Djamena, au Tchad</strong>.
      </p>
    `,
  },
  {
    id: "decret-snrc-8",
    question: "Quelle est la durée de vie statutaire de la SNRC ?",
    answer: `
      <p>
        La SNRC est constituée pour une durée de <strong>99 ans</strong>, sauf
        cas de dissolution anticipée ou de prorogation conformément aux
        dispositions prévues par ses statuts.
      </p>
    `,
  },
  {
    id: "decret-snrc-9",
    question: "Quels sont les organes de gouvernance de la SNRC ?",
    answer: `
      <p>
        La gouvernance de la SNRC repose notamment sur l’Assemblée générale, le
        Conseil d’administration, la Direction générale et les organes de contrôle
        prévus par les textes applicables.
      </p>
    `,
  },
  {
    id: "decret-snrc-10",
    question: "Où consulter le décret portant statuts de la SNRC ?",
    answer: `
      <p>
        Le décret portant statuts de la SNRC peut être consulté dans la rubrique
        <strong>Publications</strong> ou <strong>Documents officiels</strong> du site.
      </p>
    `,
  },
];

function normalizeQuestion(question = "") {
  return question
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaqs()
      .then((data) => setFaqs(Array.isArray(data) ? data : []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  const displayedFaqs = useMemo(() => {
    const allFaqs = [...officialFaqs, ...faqs];
    const seen = new Set();

    return allFaqs.filter((item) => {
      const key = normalizeQuestion(item.question);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [faqs]);

  return (
    <>
      {usePageMeta({
        title: "Questions fréquentes",
        description:
          "Questions fréquentes sur les informations, services, publications et le cadre juridique de la SNRC.",
      })}

      <PageBanner
        title="FAQ"
        subtitle="Questions fréquentes sur les informations, services, publications et le cadre juridique de la SNRC."
        badge="FAQ"
        backgroundImage="/images/sections/snrc.png"
      />

      <section className="section-snrc bg-snrc-light">
        <Container>
          <div className="mb-8 max-w-3xl">
            <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
              Questions fréquentes
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
              Comprendre la SNRC et son cadre institutionnel
            </h2>

            <p className="mt-4 leading-7 text-snrc-blue/80">
              Cette rubrique regroupe les réponses essentielles sur la SNRC, ses
              missions, sa gouvernance, sa tutelle et son cadre juridique.
            </p>
          </div>

          <div className="grid gap-4">
            {loading && displayedFaqs.length === 0 ? (
              <p className="text-snrc-blue/80">
                Chargement des questions fréquentes...
              </p>
            ) : displayedFaqs.length === 0 ? (
              <p className="text-snrc-blue/80">
                Aucune question fréquente disponible.
              </p>
            ) : (
              displayedFaqs.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <article
                    key={item.id || item.question}
                    className="card-snrc overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className="font-display text-lg font-bold text-snrc-blue">
                        {item.question}
                      </span>

                      <ChevronDown
                        size={20}
                        aria-hidden="true"
                        className={`shrink-0 text-snrc-blue transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen ? (
                      <div
                        id={`faq-answer-${index}`}
                        className="border-t border-snrc-blue/10 px-6 pb-6 pt-5"
                      >
                        <RichContent
                          content={item.answer}
                          className="text-snrc-blue/80"
                        />
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        </Container>
      </section>

      <section className="section-snrc bg-white">
        <Container>
          <div className="card-snrc grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
                Document officiel
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
                Consulter le décret portant statuts de la SNRC
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-snrc-blue/85">
                Le décret portant statuts de la SNRC définit le cadre juridique,
                l’organisation, les missions, la gouvernance et les règles de
                fonctionnement de l’institution.
              </p>
            </div>

            <a
              href="/documents/decret-0539-statuts-snrc.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 btn-snrc-secondary"
            >
              <FileText size={18} />
              Voir le décret
            </a>
          </div>
        </Container>
      </section>

      <section className="section-snrc bg-white">
        <Container>
          <div className="card-snrc grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex rounded-full bg-snrc-red/10 px-3 py-1 text-sm font-semibold text-snrc-red">
                Besoin d’aide supplémentaire ?
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl">
                Contactez directement la SNRC
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-snrc-blue/85">
                Si vous ne trouvez pas votre réponse dans cette rubrique, vous
                pouvez utiliser le formulaire de contact pour nous écrire.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 btn-snrc-primary"
            >
              <Mail size={18} />
              Nous contacter
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}