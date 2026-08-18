import { query } from "../config/db.js";

export const SettingsModel = {
  async get() {
    const result = await query(`SELECT * FROM settings ORDER BY id ASC LIMIT 1`);
    return result.rows[0] || null;
  },
  async update(payload) {
    const current = await this.get();
    if (!current) {
      const inserted = await query(
        `INSERT INTO settings
         (site_name, site_tagline, site_description, contact_email, contact_phone, contact_phone_secondary, address, footer_text, logo_url, favicon_url, facebook_url, linkedin_url, x_url, youtube_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
        [
          payload.site_name || "SNRC", payload.site_tagline || null, payload.site_description || null,
          payload.contact_email || null, payload.contact_phone || null, payload.contact_phone_secondary || null, payload.address || null,
          payload.footer_text || null, payload.logo_url || null, payload.favicon_url || null,
          payload.facebook_url || null, payload.linkedin_url || null, payload.x_url || null, payload.youtube_url || null,
        ]
      );
      return inserted.rows[0];
    }
    const result = await query(
      `UPDATE settings SET site_name=$1, site_tagline=$2, site_description=$3, contact_email=$4,
       contact_phone=$5, contact_phone_secondary=$6, address=$7, footer_text=$8, logo_url=$9, favicon_url=$10, facebook_url=$11,
       linkedin_url=$12, x_url=$13, youtube_url=$14, updated_at=NOW() WHERE id=$15 RETURNING *`,
      [
        payload.site_name ?? current.site_name, payload.site_tagline ?? current.site_tagline,
        payload.site_description ?? current.site_description, payload.contact_email ?? current.contact_email,
        payload.contact_phone ?? current.contact_phone, payload.contact_phone_secondary ?? current.contact_phone_secondary, payload.address ?? current.address,
        payload.footer_text ?? current.footer_text, payload.logo_url ?? current.logo_url,
        payload.favicon_url ?? current.favicon_url, payload.facebook_url ?? current.facebook_url,
        payload.linkedin_url ?? current.linkedin_url, payload.x_url ?? current.x_url,
        payload.youtube_url ?? current.youtube_url, current.id,
      ]
    );
    return result.rows[0];
  },
};
