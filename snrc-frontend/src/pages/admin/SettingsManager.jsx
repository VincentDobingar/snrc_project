import { useEffect, useState } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
} from "../../api/adminApi";
import { uploadImage } from "../../api/uploadApi";
import UploadField from "../../components/admin/UploadField";

const initialForm = {
  site_name: "",
  site_tagline: "",
  site_description: "",
  contact_email: "",
  contact_phone: "",
  contact_phone_secondary: "",
  address: "",
  footer_text: "",
  logo_url: "",
  favicon_url: "",
  facebook_url: "",
  linkedin_url: "",
  x_url: "",
  youtube_url: "",
};

export default function SettingsManager() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setFeedback("");

    try {
      const data = await getAdminSettings();

      if (data) {
        setForm({
          site_name: data.site_name || "",
          site_tagline: data.site_tagline || "",
          site_description: data.site_description || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          contact_phone_secondary: data.contact_phone_secondary || "",
          address: data.address || "",
          footer_text: data.footer_text || "",
          logo_url: data.logo_url || "",
          favicon_url: data.favicon_url || "",
          facebook_url: data.facebook_url || "",
          linkedin_url: data.linkedin_url || "",
          x_url: data.x_url || "",
          youtube_url: data.youtube_url || "",
        });
      }
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          "Impossible de charger les paramètres."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogoUpload(file) {
    setUploadingLogo(true);
    setFeedback("");

    try {
      const uploadedPath = await uploadImage(file);
      setForm((prev) => ({ ...prev, logo_url: uploadedPath }));
      setFeedback("Logo envoyé avec succès.");
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l’envoi du logo."
      );
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleFaviconUpload(file) {
    setUploadingFavicon(true);
    setFeedback("");

    try {
      const uploadedPath = await uploadImage(file);
      setForm((prev) => ({ ...prev, favicon_url: uploadedPath }));
      setFeedback("Favicon envoyé avec succès.");
    } catch (error) {
      setFeedback(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l’envoi du favicon."
      );
    } finally {
      setUploadingFavicon(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      const result = await updateAdminSettings(form);
      setFeedback(result?.message || "Paramètres mis à jour avec succès.");
      await loadSettings();
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFeedback(validationErrors.map((item) => item.message).join(" • "));
      } else {
        setFeedback(
          error?.response?.data?.message ||
            "Erreur lors de la mise à jour des paramètres."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card-snrc p-8">
        <p className="font-medium text-snrc-blue">
          Chargement des paramètres...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
          Paramètres
        </span>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snrc-blue">
          Paramètres du site
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-7 text-snrc-blue/75">
          Configurez les informations générales, les coordonnées, les visuels et
          les réseaux sociaux du site SNRC.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="card-snrc p-6 lg:p-8">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Informations générales
          </h3>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                Nom du site
              </label>
              <input
                type="text"
                name="site_name"
                value={form.site_name}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="SNRC"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                Slogan / sous-titre
              </label>
              <input
                type="text"
                name="site_tagline"
                value={form.site_tagline}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="Société Nationale de Recouvrement des Créances"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-snrc-blue">
                Description du site
              </label>
              <textarea
                rows="5"
                name="site_description"
                value={form.site_description}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="Description institutionnelle du site"
              />
            </div>
          </div>
        </section>

        <section className="card-snrc p-6 lg:p-8">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Coordonnées
          </h3>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                Email de contact
              </label>
              <input
                type="email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="contact@snrc.td"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                Téléphone principal
              </label>
              <input
                type="text"
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="+235 ..."
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                Téléphone secondaire
              </label>
              <input
                type="text"
                name="contact_phone_secondary"
                value={form.contact_phone_secondary}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="+235 ..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-snrc-blue">
                Adresse
              </label>
              <textarea
                rows="4"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="N'Djamena, Tchad"
              />
            </div>
          </div>
        </section>

        <section className="card-snrc p-6 lg:p-8">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Visuels du site
          </h3>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <UploadField
              label="Logo"
              value={form.logo_url}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, logo_url: value }))
              }
              onUpload={handleLogoUpload}
              uploading={uploadingLogo}
              accept="image/*"
              placeholder="https://... ou /uploads/images/logo.png"
            />

            <UploadField
              label="Favicon"
              value={form.favicon_url}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, favicon_url: value }))
              }
              onUpload={handleFaviconUpload}
              uploading={uploadingFavicon}
              accept="image/*"
              placeholder="https://... ou /uploads/images/favicon.png"
            />
          </div>
        </section>

        <section className="card-snrc p-6 lg:p-8">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Réseaux sociaux
          </h3>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                Facebook
              </label>
              <input
                type="url"
                name="facebook_url"
                value={form.facebook_url}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={form.linkedin_url}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="https://linkedin.com/..."
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                X
              </label>
              <input
                type="url"
                name="x_url"
                value={form.x_url}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="https://x.com/..."
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                YouTube
              </label>
              <input
                type="url"
                name="youtube_url"
                value={form.youtube_url}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </section>

        <section className="card-snrc p-6 lg:p-8">
          <h3 className="font-display text-2xl font-bold text-snrc-blue">
            Pied de page
          </h3>

          <div className="mt-8 grid gap-6">
            <div>
              <label className="mb-2 block font-medium text-snrc-blue">
                Texte du footer
              </label>
              <textarea
                rows="5"
                name="footer_text"
                value={form.footer_text}
                onChange={handleChange}
                className="w-full rounded-xl border border-snrc-blue/15 px-4 py-3 outline-none transition focus:border-snrc-blue"
                placeholder="Texte affiché dans le pied de page"
              />
            </div>
          </div>
        </section>

        {feedback ? (
          <div className="rounded-xl border border-snrc-blue/10 bg-snrc-light px-4 py-3 text-sm font-medium text-snrc-blue">
            {feedback}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={loadSettings}
            className="rounded-xl border border-snrc-blue/15 px-5 py-3 font-medium text-snrc-blue transition hover:bg-snrc-light"
          >
            Recharger
          </button>

          <button type="submit" className="btn-snrc-primary" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </button>
        </div>
      </form>
    </div>
  );
}