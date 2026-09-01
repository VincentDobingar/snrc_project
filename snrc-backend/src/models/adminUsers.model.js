import { query, withTransaction } from "../config/db.js";

export const AdminUsersModel = {
  async listAll({ limit = 50, offset = 0 } = {}) {
    const [result, countResult] = await Promise.all([
      query(
        `SELECT id, full_name, email, role, status, last_login_at, created_at FROM admins
         ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query(`SELECT COUNT(*)::int AS count FROM admins`),
    ]);
    return { rows: result.rows, total: countResult.rows[0].count };
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
  async updatePassword(id, password_hash) {
    const result = await query(`UPDATE admins SET password_hash=$1, updated_at=NOW() WHERE id=$2 RETURNING id`, [password_hash, id]);
    return result.rows[0] || null;
  },
  async bumpTokenVersion(id) {
    const result = await query(
      `UPDATE admins SET token_version = token_version + 1 WHERE id=$1 RETURNING id, token_version`,
      [id]
    );
    return result.rows[0] || null;
  },
  // Verrouille (SELECT ... FOR UPDATE) les autres superadmins actifs et
  // n'applique l'UPDATE que si au moins un en reste, le tout dans une seule
  // transaction : élimine la race condition où deux requêtes concurrentes
  // désactivant deux superadmins différents pouvaient chacune lire "il en
  // reste un autre" et aboutir à zéro superadmin actif au final.
  async updateWithGuard(id, payload, { guardLastSuperadmin = false } = {}) {
    return withTransaction(async (client) => {
      if (guardLastSuperadmin) {
        const lockResult = await client.query(
          `SELECT id FROM admins WHERE role='superadmin' AND status='active' AND id != $1 FOR UPDATE`,
          [id]
        );
        if (lockResult.rows.length === 0) {
          const error = new Error("Impossible de désactiver/supprimer le dernier superadministrateur actif");
          error.status = 400;
          throw error;
        }
      }
      const result = await client.query(
        `UPDATE admins SET full_name=$1, email=$2, role=$3, status=$4, updated_at=NOW()
         WHERE id=$5 RETURNING id, full_name, email, role, status, last_login_at, created_at`,
        [payload.full_name, payload.email, payload.role || "admin_editeur", payload.status || "active", id]
      );
      return result.rows[0] || null;
    });
  },

  async removeWithGuard(id, { guardLastSuperadmin = false } = {}) {
    return withTransaction(async (client) => {
      if (guardLastSuperadmin) {
        const lockResult = await client.query(
          `SELECT id FROM admins WHERE role='superadmin' AND status='active' AND id != $1 FOR UPDATE`,
          [id]
        );
        if (lockResult.rows.length === 0) {
          const error = new Error("Impossible de désactiver/supprimer le dernier superadministrateur actif");
          error.status = 400;
          throw error;
        }
      }
      const result = await client.query(`DELETE FROM admins WHERE id=$1 RETURNING id`, [id]);
      return result.rows[0] || null;
    });
  },
};
