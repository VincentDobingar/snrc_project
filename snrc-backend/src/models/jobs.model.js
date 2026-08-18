import { query } from "../config/db.js";

export const JobOffersModel = {
  async listPublic() {
    const result = await query(
      `SELECT * FROM job_offers
       WHERE status='published'
       AND (application_deadline IS NULL OR application_deadline >= NOW())
       ORDER BY COALESCE(published_at, created_at) DESC`
    );
    return result.rows;
  },
  async listAll() {
    const result = await query(`SELECT * FROM job_offers ORDER BY COALESCE(published_at, created_at) DESC`);
    return result.rows;
  },
  async findBySlug(slug) {
    const result = await query(
      `SELECT * FROM job_offers WHERE slug=$1 AND status='published' LIMIT 1`,
      [slug]
    );
    return result.rows[0] || null;
  },
  async findById(id) {
    const result = await query(`SELECT * FROM job_offers WHERE id=$1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO job_offers (title, slug, contract_type, location, summary, description, requirements, application_deadline, status, published_at, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11) RETURNING *`,
      [
        payload.title, payload.slug, payload.contract_type || null, payload.location || null,
        payload.summary || null, payload.description, payload.requirements || null,
        payload.application_deadline || null, payload.status || "draft",
        payload.published_at || null, payload.user_id,
      ]
    );
    return result.rows[0];
  },
  async update(id, payload) {
    const result = await query(
      `UPDATE job_offers SET title=$1, slug=$2, contract_type=$3, location=$4, summary=$5, description=$6,
       requirements=$7, application_deadline=$8, status=$9, published_at=$10, updated_by=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [
        payload.title, payload.slug, payload.contract_type || null, payload.location || null,
        payload.summary || null, payload.description, payload.requirements || null,
        payload.application_deadline || null, payload.status || "draft",
        payload.published_at || null, payload.user_id, id,
      ]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM job_offers WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
