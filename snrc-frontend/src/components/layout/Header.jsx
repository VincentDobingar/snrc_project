import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Mail, Menu, Phone, X } from "lucide-react";
import { getSettings } from "../../api/settingsApi";

const navItems = [
  { label: "Accueil", to: "/" },
  { label: "La SNRC", to: "/la-snrc" },
  { label: "Missions", to: "/missions" },
  { label: "Services", to: "/services" },
  { label: "Actualités", to: "/actualites" },
  { label: "Publications", to: "/publications" },
  { label: "Carrières", to: "/carrieres" },
  { label: "FAQ", to: "/faq" },
];

const socialFields = [
  { key: "facebook_url", label: "Facebook" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "x_url", label: "X" },
  { key: "youtube_url", label: "YouTube" },
];

function navLinkClass({ isActive }) {
  return [
    "transition-colors duration-200",
    "hover:text-snrc-red",
    isActive ? "text-snrc-red font-semibold" : "text-snrc-dark",
  ].join(" ");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  const activeSocialLinks = socialFields.filter((item) => settings?.[item.key]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-white/10 bg-snrc-blue lg:block">
        <div className="container-snrc flex items-center justify-between py-2 text-sm text-white/90">
          <div className="flex items-center">
            <span className="font-medium text-white/80">
              Institution publique • Information institutionnelle
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <a
              href="mailto:contact@snrc.td"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Mail size={16} />
              <span>contact@snrc.td</span>
            </a>

            <a
              href="tel:+23530565295"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Phone size={16} />
              <span>+235 30 56 52 95</span>
            </a>

            <a
              href="tel:+23565537348"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Phone size={16} />
              <span>+235 65 53 73 48</span>
            </a>

            {activeSocialLinks.map((item) => (
              <a
                key={item.key}
                href={settings[item.key]}
                target="_blank"
                rel="noreferrer"
                className="text-white/85 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100">
        <div className="container-snrc flex h-20 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo-snrc.png"
              alt="Logo SNRC"
              className="h-12 w-auto object-contain"
            />

            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-snrc-blue">
                Société Nationale de
              </p>
              <p className="text-sm font-semibold text-snrc-blue">
                Recouvrement des Créances
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link to="/contact" className="btn-snrc-primary">
              Nous contacter
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="inline-flex rounded-xl border border-gray-200 p-2 text-snrc-blue lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="container-snrc flex flex-col py-4">
            <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-snrc-light p-4 text-sm text-snrc-blue">
              <a
                href="mailto:contact@snrc.td"
                className="inline-flex items-center gap-2"
              >
                <Mail size={16} />
                <span>contact@snrc.td</span>
              </a>

              <a
                href="tel:+23530565295"
                className="inline-flex items-center gap-2"
              >
                <Phone size={16} />
                <span>+235 30 56 52 95</span>
              </a>

              <a
                href="tel:+23565537348"
                className="inline-flex items-center gap-2"
              >
                <Phone size={16} />
                <span>+235 65 53 73 48</span>
              </a>
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-3 py-3 transition-colors",
                    isActive
                      ? "bg-snrc-blue/10 font-semibold text-snrc-blue"
                      : "text-snrc-dark hover:bg-gray-50",
                  ].join(" ")
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/contact"
              className="btn-snrc-primary mt-4"
              onClick={() => setOpen(false)}
            >
              Nous contacter
            </Link>

            {activeSocialLinks.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-snrc-blue">
                {activeSocialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={settings[item.key]}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-snrc-blue/15 px-3 py-2 hover:bg-snrc-light"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}