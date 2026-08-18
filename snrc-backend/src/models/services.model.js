import { query } from "../config/db.js";

export const ServicesModel = {
  async listPublic() {
    const result = await query(`SELECT * FROM services WHERE status='published' ORDER BY display_order ASC, id DESC`);
    return result.rows;
  },
  async listAll() {
    const result = await query(`SELECT * FROM services ORDER BY display_order ASC, id DESC`);
    return result.rows;
  },
  async findById(id) {
    const result = await query(`SELECT * FROM services WHERE id=$1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO services (title, slug, summary, content, icon, image, display_order, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        payload.title, payload.slug, payload.summary || null, payload.content || null,
        payload.icon || null, payload.image || null, payload.display_order || 0,
        payload.status || "published",
      ]
    );
    return result.rows[0];
  },
  async update(id, payload) {
    const result = await query(
      `UPDATE services SET title=$1, slug=$2, summary=$3, content=$4, icon=$5, image=$6,
       display_order=$7, status=$8, updated_at=NOW() WHERE id=$9 RETURNING *`,
      [
        payload.title, payload.slug, payload.summary || null, payload.content || null,
        payload.icon || null, payload.image || null, payload.display_order || 0,
        payload.status || "published", id,
      ]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM services WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
