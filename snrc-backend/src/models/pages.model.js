import { query } from "../config/db.js";

export const PagesModel = {
  async listAll() {
    const result = await query(`SELECT * FROM pages ORDER BY id DESC`);
    return result.rows;
  },
  async findById(id) {
    const result = await query(`SELECT * FROM pages WHERE id = $1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async findPublicBySlug(slug) {
    const result = await query(
      `SELECT * FROM pages WHERE slug = $1 AND status = 'published' LIMIT 1`,
      [slug]
    );
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO pages
       (title, slug, summary, content, banner_image, meta_title, meta_description, status, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)
       RETURNING *`,
      [
        payload.title, payload.slug, payload.summary || null, payload.content || null,
        payload.banner_image || null, payload.meta_title || null,
        payload.meta_description || null, payload.status || "published", payload.user_id,
      ]
    );
    return result.rows[0];
  },
  async update(id, payload) {
    const result = await query(
      `UPDATE pages SET
       title=$1, slug=$2, summary=$3, content=$4, banner_image=$5,
       meta_title=$6, meta_description=$7, status=$8, updated_by=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [
        payload.title, payload.slug, payload.summary || null, payload.content || null,
        payload.banner_image || null, payload.meta_title || null,
        payload.meta_description || null, payload.status || "published", payload.user_id, id,
      ]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM pages WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
