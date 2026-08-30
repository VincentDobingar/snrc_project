import { query } from "../config/db.js";

export const SettingsModel = {
  async get() {
    const result = await query(`SELECT * FROM settings ORDER BY id ASC LIMIT 1`);
    return result.rows[0] || null;
  },
  async update(payload) {
    // Upsert atomique : l'index unique settings_singleton_idx sur ((true))
    // garantit qu'il ne peut jamais exister plus d'une ligne, même en cas
    // d'écritures concurrentes lors de la toute première initialisation
    // (SELECT-puis-INSERT/UPDATE séparés créait auparavant une race condition).
    // Les paramètres bruts (null quand le champ n'est pas fourni) sont
    // référencés directement dans le DO UPDATE SET, pas via EXCLUDED, afin que
    // COALESCE($n, settings.colonne) conserve bien la valeur existante quand
    // le champ n'est pas fourni dans le payload.
    const result = await query(
      `INSERT INTO settings
        (site_name, site_tagline, site_description, contact_email, contact_phone,
         contact_phone_secondary, address, footer_text, logo_url, favicon_url,
         facebook_url, linkedin_url, x_url, youtube_url)
       VALUES (COALESCE($1, 'SNRC'), $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT ((true)) DO UPDATE SET
         site_name = COALESCE($1, settings.site_name),
         site_tagline = COALESCE($2, settings.site_tagline),
         site_description = COALESCE($3, settings.site_description),
         contact_email = COALESCE($4, settings.contact_email),
         contact_phone = COALESCE($5, settings.contact_phone),
         contact_phone_secondary = COALESCE($6, settings.contact_phone_secondary),
         address = COALESCE($7, settings.address),
         footer_text = COALESCE($8, settings.footer_text),
         logo_url = COALESCE($9, settings.logo_url),
         favicon_url = COALESCE($10, settings.favicon_url),
         facebook_url = COALESCE($11, settings.facebook_url),
         linkedin_url = COALESCE($12, settings.linkedin_url),
         x_url = COALESCE($13, settings.x_url),
         youtube_url = COALESCE($14, settings.youtube_url),
         updated_at = NOW()
       RETURNING *`,
      [
        payload.site_name ?? null, payload.site_tagline ?? null, payload.site_description ?? null,
        payload.contact_email ?? null, payload.contact_phone ?? null, payload.contact_phone_secondary ?? null, payload.address ?? null,
        payload.footer_text ?? null, payload.logo_url ?? null, payload.favicon_url ?? null,
        payload.facebook_url ?? null, payload.linkedin_url ?? null, payload.x_url ?? null, payload.youtube_url ?? null,
      ]
    );
    return result.rows[0];
  },
};
