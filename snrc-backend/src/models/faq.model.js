import { query } from "../config/db.js";

export const FAQModel = {
  async listPublic() {
    const result = await query(`SELECT * FROM faqs WHERE status='active' ORDER BY display_order ASC, id DESC`);
    return result.rows;
  },
  async listAll() {
    const result = await query(`SELECT * FROM faqs ORDER BY display_order ASC, id DESC`);
    return result.rows;
  },
  async findById(id) {
    const result = await query(`SELECT * FROM faqs WHERE id=$1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO faqs (question, answer, display_order, status)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [payload.question, payload.answer, payload.display_order || 0, payload.status || "active"]
    );
    return result.rows[0];
  },
  async update(id, payload) {
    const result = await query(
      `UPDATE faqs SET question=$1, answer=$2, display_order=$3, status=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [payload.question, payload.answer, payload.display_order || 0, payload.status || "active", id]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM faqs WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
