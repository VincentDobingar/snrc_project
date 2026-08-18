import { useEffect, useState } from "react";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Users2,
} from "lucide-react";
import PageBanner from "../../components/layout/PageBanner";
import Container from "../../components/ui/Container";
import RichContent from "../../components/ui/RichContent";
import { getPageBySlug } from "../../api/pagesApi";
import { getSettings } from "../../api/settingsApi";
import { sendContactMessage } from "../../api/contactApi";
import usePageMeta from "../../hooks/usePageMeta";

const socialFields = [
  { key: "facebook_url", label: "Facebook" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "youtube_url", label: "YouTube" },
  { key: "x_url", label: "X" },
];

const highlights = [
  {
    title: "Information institutionnelle",
    text: "Adressez vos demandes d’information, d’orientation ou de clarification relatives aux missions et au champ d’intervention de la SNRC.",
    icon: ShieldCheck,
  },
  {
    title: "Correspondances officielles",
    text: "Utilisez ce canal pour toute prise de contact institutionnelle, demande formelle ou communication destinée à la SNRC.",
    icon: Mail,
  },
  {
    title: "Collaboration et coordination",
    text: "La page contact facilite les échanges avec les partenaires, institutions et parties prenantes concernées.",
    icon: Users2,
  },
];

export default function Contact() {
  const [page, setPage] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    getPageBySlug("contact")
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoadingPage(false));
  }, []);

  useEffect(() => {
    getSettings()
      .then((data) => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const result = await sendContactMessage(form);
      setFeedback(result?.message || "Message envoyé avec succès.");
      setForm({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Erreur lors de l’envoi du message."
      );
    } finally {
      setLoading(false);
    }
  }

  const title = page?.title || "Contact";
  const summary =
    page?.summary ||
    "Prenez contact avec la SNRC pour toute demande d’information, communication officielle ou besoin d’orientation institutionnelle.";

  const content =
    page?.content ||
    `<p>La page Contact permet d’entrer en relation avec la Société Nationale de Recouvrement des Créances (SNRC) pour toute demande d’information, correspondance officielle ou orientation institutionnelle.</p>
     <p>Elle s’inscrit dans une logique de communication claire, de collaboration active et d’accès structuré à l’information institutionnelle.</p>
     <p>Les demandes transmises via ce canal sont destinées à faciliter les échanges avec les partenaires, institutions et parties prenantes concernées.</p>`;

  return (
    <>
      {usePageMeta({ title, description: summary })}

      <PageBanner
        title={title}
        subtitle={summary}
        badge="Contact"
        light
        backgroundImage="/images/sections/snrc.png"
      />

      <section className="section-snrc bg-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
              Prise de contact institutionnelle
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              {loadingPage ? "Chargement..." : title}
            </h2>

            <RichContent content={content} className="mt-4" />
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
              Échanges et orientation
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue sm:text-4xl lg:text-5xl">
              VOUS SOUHAITEZ CONFIER VOS CRÉANCES À LA SNRC ?
            </h2>

            <p className="mt-4 text-base leading-7 text-snrc-blue/85 sm:text-lg">
              Contactez-nous pour étudier les modalités d'un partenariat adapté à vos besoins.
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
        <Container className="grid gap-8 lg:grid-cols-2">
          <article className="card-snrc p-6 lg:p-8">
            <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
              Coordonnées
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold text-snrc-blue">
              Restons en contact
            </h2>

            <div className="mt-8 space-y-5 text-snrc-blue/85">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-snrc-blue/10 p-3 text-snrc-blue">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-semibold text-snrc-blue">Adresse</p>
                  <p className="mt-1">{settings?.address || "Rond-point Globe, N'Djamena – République du Tchad"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-snrc-blue/10 p-3 text-snrc-blue">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-semibold text-snrc-blue">Téléphone</p>
                  <p className="mt-1">
                    {settings?.contact_phone || "+235 30 56 52 95 / 65 53 73 48"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-snrc-blue/10 p-3 text-snrc-blue">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-semibold text-snrc-blue">Email</p>
                  <p className="mt-1">
                    {settings?.contact_email || "contact@snrc.td"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-snrc-blue/10 p-3 text-snrc-blue">
                  <Clock3 size={20} />
                </div>
                <div>
                  <p className="font-semibold text-snrc-blue">Disponibilité</p>
                  <p className="mt-1">Lundi à vendredi</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialFields
                .filter((item) => settings?.[item.key])
                .map((item) => (
                  <a
                    key={item.key}
                    href={settings[item.key]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-snrc-blue/15 bg-snrc-light px-4 py-2 text-snrc-blue transition hover:bg-snrc-blue hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </article>

          <article className="card-snrc p-6 lg:p-8">
            <span className="inline-flex rounded-full bg-snrc-gold/15 px-3 py-1 text-sm font-semibold text-snrc-gold">
              Formulaire
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold text-snrc-blue">
              Envoyez-nous un message
            </h2>

            <p className="mt-3 text-base leading-7 text-snrc-blue/75">
              Utilisez ce formulaire pour toute demande d’information, d’orientation
              ou de communication institutionnelle.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block font-medium text-snrc-blue">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-snrc-blue">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                  placeholder="Votre adresse email"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-snrc-blue">
                  Téléphone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                  placeholder="Votre numéro"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-snrc-blue">
                  Sujet
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                  placeholder="Objet du message"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-snrc-blue">
                  Message
                </label>
                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                  placeholder="Votre message"
                />
              </div>

              {feedback ? (
                <p className="text-sm font-medium text-snrc-blue">{feedback}</p>
              ) : null}

              <button
                type="submit"
                className="btn-snrc-primary inline-flex items-center gap-2"
                disabled={loading}
              >
                <Send size={18} />
                {loading ? "Envoi..." : "Envoyer le message"}
              </button>
            </form>
          </article>
        </Container>
      </section>
    </>
  );
}