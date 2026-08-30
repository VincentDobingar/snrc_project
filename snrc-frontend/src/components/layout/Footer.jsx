import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe2,
  Landmark,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

const socialLinks = [
  { key: "facebook_url", label: "Facebook" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "youtube_url", label: "YouTube" },
  { key: "x_url", label: "X" },
];

const navigationLinks = [
  { label: "Accueil", to: "/" },
  { label: "La SNRC", to: "/la-snrc" },
  { label: "Missions", to: "/missions" },
  { label: "Services", to: "/services" },
  { label: "Actualités", to: "/actualites" },
  { label: "Publications", to: "/publications" },
  { label: "Carrières", to: "/carrieres" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const institutionalLinks = [
  { label: "Gouvernance", to: "/la-snrc" },
  { label: "Informations institutionnelles", to: "/publications" },
  { label: "Communiqués", to: "/actualites" },
  { label: "Documents publics", to: "/publications" },
];

function buildPhoneLines(settings) {
  const phones = [];

  if (settings?.contact_phone) {
    phones.push(settings.contact_phone);
  }

  if (settings?.contact_phone_secondary) {
    phones.push(settings.contact_phone_secondary);
  }

  if (phones.length === 0) {
    phones.push("+235 30 56 52 95", "+235 65 53 73 48");
  }

  return phones;
}

function cleanTel(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}

export default function Footer() {
  const { settings } = useSettings();
  const [logoSrc, setLogoSrc] = useState("/images/logo-snrc1.png");

  const phones = useMemo(() => buildPhoneLines(settings), [settings]);

  const email = settings?.contact_email || "contact@snrc.td";

  const address =
    settings?.contact_address ||
    settings?.address ||
    "N'Djamena, République du Tchad";

  const siteDescription =
    settings?.site_description ||
    "Institution dédiée au recouvrement des créances en difficulté, à la gestion des créances confiées et à la contribution à l’assainissement du système financier national.";

  const footerText =
    settings?.footer_text ||
    "La SNRC intervient dans un cadre institutionnel structuré afin de renforcer la mobilisation, le suivi, le recouvrement et la valorisation des créances.";

  const activeSocialLinks = socialLinks.filter((item) => settings?.[item.key]);

  return (
    <footer className="relative mt-20 overflow-hidden bg-slate-950 text-white">
      {/* Effets visuels premium */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.28),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(14,165,233,0.14),transparent_34%)]" />

      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.4)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Bande institutionnelle supérieure */}
      <div className="relative z-10 border-b border-white/10 bg-white/[0.03]">
        <div className="container-snrc flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold text-blue-50">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-700">
              <ShieldCheck size={20} />
            </span>
            <span>
              Institution publique dédiée au recouvrement et à la valorisation
              des créances.
            </span>
          </div>

          <Link
            to="/contact"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
          >
            Contact institutionnel
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container-snrc relative z-10 grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-[1.35fr_0.8fr_0.9fr_1fr]">
        {/* Identité */}
        <div>
        <Link to="/" className="group inline-flex items-center gap-4">
<span className="flex h-24 w-24 items-center justify-center bg-transparent">
  <img
    src={logoSrc}
    alt="Logo SNRC"
    className="h-full w-full object-contain drop-shadow-2xl"
    onError={() => setLogoSrc("/images/logo-snrc.png")}
  />
</span>

          <span>
            <span className="block font-display text-xl font-black leading-tight text-white">
              Société Nationale de
            </span>
            <span className="block font-display text-xl font-black leading-tight text-white">
              Recouvrement des Créances
            </span>
            <span className="mt-2 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-blue-100">
              SNRC
            </span>
          </span>
        </Link>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
            {siteDescription}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-100">
                <Landmark size={17} />
                Institution
              </div>
              <p className="text-xs leading-6 text-white/70">
                Recouvrement, suivi et gestion des créances confiées.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-100">
                <Globe2 size={17} />
                Portail officiel
              </div>
              <p className="text-xs leading-6 text-white/70">
                Informations, publications et ressources institutionnelles.
              </p>
            </div>
          </div>

          {activeSocialLinks.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                Réseaux sociaux
              </p>

              <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={settings[item.key]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
                  >
                    {item.label}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-display text-lg font-black text-white">
            Navigation
          </h3>

          <div className="mt-5 space-y-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <span>{item.label}</span>
                <ChevronRight
                  size={16}
                  className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Coordonnées */}
        <div>
          <h3 className="font-display text-lg font-black text-white">
            Coordonnées
          </h3>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700">
                  <MapPin size={20} />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                    Adresse
                  </p>
                  <p className="mt-1 text-sm font-bold leading-6 text-white">
                    {address}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700">
                  <Phone size={20} />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                    Téléphone
                  </p>

                  <div className="mt-1 space-y-1">
                    {phones.map((phone) => (
                      <a
                        key={phone}
                        href={cleanTel(phone)}
                        className="block text-sm font-bold leading-6 text-white transition hover:text-blue-200"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700">
                  <Mail size={20} />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 block break-all text-sm font-bold leading-6 text-white transition hover:text-blue-200"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div>
          <h3 className="font-display text-lg font-black text-white">
            Informations
          </h3>

          <p className="mt-5 text-sm leading-7 text-white/75">
            {footerText}
          </p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <FileText size={20} />
              </span>

              <div>
                <p className="text-sm font-black text-white">
                  Ressources publiques
                </p>
                <p className="text-xs text-white/55">
                  Documents et informations utiles
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {institutionalLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    size={16}
                    className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="container-snrc flex flex-col gap-3 py-5 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-white">SNRC</span>. Tous droits
            réservés.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p>Site institutionnel officiel</p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-blue-200"
            >
              Contact
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}