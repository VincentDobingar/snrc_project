import { query } from "../config/db.js";

export const NewsModel = {
  async listPublic(limit = 20) {
    const result = await query(
      `SELECT * FROM news WHERE status='published'
       ORDER BY COALESCE(published_at, created_at) DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  },
  async listAll({ limit = 50, offset = 0 } = {}) {
    const [result, countResult] = await Promise.all([
      query(
        `SELECT * FROM news ORDER BY COALESCE(published_at, created_at) DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query(`SELECT COUNT(*)::int AS count FROM news`),
    ]);
    return { rows: result.rows, total: countResult.rows[0].count };
  },
  async findBySlug(slug) {
    const result = await query(`SELECT * FROM news WHERE slug=$1 AND status='published' LIMIT 1`, [slug]);
    return result.rows[0] || null;
  },
  async findById(id) {
    const result = await query(`SELECT * FROM news WHERE id=$1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO news (title, slug, summary, content, featured_image, status, published_at, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING *`,
      [
        payload.title, payload.slug, payload.summary || null, payload.content,
        payload.featured_image || null, payload.status || "draft",
        payload.published_at || null, payload.user_id,
      ]
    );
    return result.rows[0];
  },
  async update(id, payload) {
    const result = await query(
      `UPDATE news SET title=$1, slug=$2, summary=$3, content=$4, featured_image=$5,
       status=$6, published_at=$7, updated_by=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [
        payload.title, payload.slug, payload.summary || null, payload.content,
        payload.featured_image || null, payload.status || "draft",
        payload.published_at || null, payload.user_id, id,
      ]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM news WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
