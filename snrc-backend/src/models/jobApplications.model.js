import { query } from "../config/db.js";

export const JobApplicationsModel = {
  async listAll({ limit = 50, offset = 0 } = {}) {
    const [result, countResult] = await Promise.all([
      query(
        `SELECT a.*, j.title AS job_title, j.slug AS job_slug
         FROM job_applications a
         JOIN job_offers j ON j.id = a.job_offer_id
         ORDER BY a.created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query(`SELECT COUNT(*)::int AS count FROM job_applications`),
    ]);
    return { rows: result.rows, total: countResult.rows[0].count };
  },
  async findById(id) {
    const result = await query(
      `SELECT a.*, j.title AS job_title, j.slug AS job_slug
       FROM job_applications a
       JOIN job_offers j ON j.id = a.job_offer_id
       WHERE a.id=$1 LIMIT 1`,
      [id]
    );
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO job_applications (job_offer_id, full_name, email, phone, education_level, cover_letter_text, cover_letter_file, cv_file)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        payload.job_offer_id, payload.full_name, payload.email, payload.phone || null,
        payload.education_level || null, payload.cover_letter_text || null,
        payload.cover_letter_file || null, payload.cv_file,
      ]
    );
    return result.rows[0];
  },
  async markAsRead(id, is_read = true) {
    const result = await query(
      `UPDATE job_applications SET is_read=$1, status=$2 WHERE id=$3 RETURNING *`,
      [is_read, is_read ? "lu" : "nouveau", id]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM job_applications WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
