import { query } from "../config/db.js";

export const MessagesModel = {
  async listAll() {
    const result = await query(`SELECT * FROM messages ORDER BY created_at DESC`);
    return result.rows;
  },
  async findById(id) {
    const result = await query(`SELECT * FROM messages WHERE id=$1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO messages (full_name, email, phone, subject, message)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [payload.full_name, payload.email, payload.phone || null, payload.subject, payload.message]
    );
    return result.rows[0];
  },
  async markAsRead(id, is_read = true) {
    const result = await query(
      `UPDATE messages SET is_read=$1, status=$2 WHERE id=$3 RETURNING *`,
      [is_read, is_read ? "read" : "new", id]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM messages WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
