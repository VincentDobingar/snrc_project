import { query } from "../config/db.js";

export const AdminUsersModel = {
  async listAll() {
    const result = await query(
      `SELECT id, full_name, email, role, status, last_login_at, created_at FROM admins ORDER BY created_at DESC`
    );
    return result.rows;
  },
  async findRawById(id) {
    const result = await query(`SELECT * FROM admins WHERE id=$1 LIMIT 1`, [id]);
    return result.rows[0] || null;
  },
  async create(payload) {
    const result = await query(
      `INSERT INTO admins (full_name, email, password_hash, role, status)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, full_name, email, role, status, created_at`,
      [payload.full_name, payload.email, payload.password_hash, payload.role || "admin_editeur", payload.status || "active"]
    );
    return result.rows[0];
  },
  async update(id, payload) {
    const result = await query(
      `UPDATE admins SET full_name=$1, email=$2, role=$3, status=$4, updated_at=NOW()
       WHERE id=$5 RETURNING id, full_name, email, role, status, last_login_at, created_at`,
      [payload.full_name, payload.email, payload.role || "admin_editeur", payload.status || "active", id]
    );
    return result.rows[0] || null;
  },
  async updatePassword(id, password_hash) {
    const result = await query(`UPDATE admins SET password_hash=$1, updated_at=NOW() WHERE id=$2 RETURNING id`, [password_hash, id]);
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await query(`DELETE FROM admins WHERE id=$1 RETURNING id`, [id]);
    return result.rows[0] || null;
  },
};
