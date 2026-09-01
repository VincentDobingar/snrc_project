import { query } from "../config/db.js";

export const PublicationsModel = {
  async listPublic() {
    const result = await query(
      `SELECT p.*, c.name AS category_name
       FROM publications p
       LEFT JOIN publication_categories c ON c.id = p.category_id
       WHERE p.status='published'
       ORDER BY COALESCE(p.published_at, p.created_at) DESC`
    );
    return result.rows;
  },
  async listAll({ limit = 50, offset = 0 } = {}) {
    const [result, countResult] = await Promise.all([
      query(
        `SELECT p.*, c.name AS category_name
         FROM publications p
         LEFT JOIN publication_categories c ON c.id = p.category_id
         ORDER BY COALESCE(p.published_at, p.created_at) DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query(`SELECT COUNT(*)::int AS count FROM publications`),
    ]);
    return { rows: result.rows, total: countResult.rows[0].count };
  },
  async findById(id) {
    const result = await query(`SELECT * FROM publications WHERE id=$1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async findBySlug(slug) {
    const result = await query(
      `SELECT p.*, c.name AS category_name
       FROM publications p
       LEFT JOIN publication_categories c ON c.id = p.category_id
       WHERE p.slug=$1 AND p.status='published' LIMIT 1`,
      [slug]
    );
    return result.rows[0] || null;
  },
  async existsByFileUrl(fileUrl) {
    const result = await query(
      `SELECT 1 FROM publications WHERE file_url=$1 AND status='published' LIMIT 1`,
      [fileUrl]
    );
    return result.rows.length > 0;
  },
  async listCategories() {
    const result = await query(`SELECT * FROM publication_categories ORDER BY name ASC`);
    return result.rows;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO publications (title, slug, category_id, description, file_url, cover_image, status, published_at, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9) RETURNING *`,
      [
        payload.title, payload.slug, payload.category_id || null,
        payload.description || null, payload.file_url, payload.cover_image || null,
        payload.status || "draft", payload.published_at || null, payload.user_id,
      ]
    );
    return result.rows[0];
  },
  async update(id, payload) {
    const result = await query(
      `UPDATE publications SET title=$1, slug=$2, category_id=$3, description=$4, file_url=$5, cover_image=$6,
       status=$7, published_at=$8, updated_by=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [
        payload.title, payload.slug, payload.category_id || null,
        payload.description || null, payload.file_url, payload.cover_image || null,
        payload.status || "draft", payload.published_at || null, payload.user_id, id,
      ]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM publications WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
