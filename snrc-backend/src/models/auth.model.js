import { query } from "../config/db.js";

export const AuthModel = {
  async findByEmail(email) {
    const result = await query(
      `SELECT id, full_name, email, password_hash, role, status, token_version FROM admins WHERE email = $1 LIMIT 1`,
      [email]
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await query(
      `SELECT id, full_name, email, role, status, token_version, last_login_at, created_at
       FROM admins WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async touchLastLogin(id) {
    await query(`UPDATE admins SET last_login_at = NOW() WHERE id = $1`, [id]);
  },

  async getTokenVersion(id) {
    const result = await query(`SELECT token_version FROM admins WHERE id = $1 LIMIT 1`, [id]);
    return result.rows[0]?.token_version ?? null;
  },
};
