import bcrypt from "bcryptjs";
import { pool, query } from "../config/db.js";

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const direct = process.argv.find((arg) => arg.startsWith(prefix));
  if (direct) return direct.slice(prefix.length);
  const index = process.argv.findIndex((arg) => arg === `--${name}`);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

async function main() {
  const full_name = getArg("name", "Admin SNRC");
  const email = getArg("email");
  const password = getArg("password");
  const role = getArg("role", "superadmin");
  const status = getArg("status", "active");
  if (!email || !password) {
    console.log('Usage: npm run create-admin -- --name "Admin SNRC" --email admin@snrc.td --password Admin@123 --role superadmin');
    process.exit(1);
  }
  const existing = await query(`SELECT id FROM admins WHERE email = $1 LIMIT 1`, [email]);
  if (existing.rows.length) {
    console.log("❌ Cet email existe déjà.");
    process.exit(1);
  }
  const password_hash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO admins (full_name, email, password_hash, role, status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, full_name, email, role, status`,
    [full_name, email, password_hash, role, status]
  );
  console.log("✅ Administrateur créé avec succès:");
  console.table(result.rows);
  await pool.end();
}

main().catch(async (error) => {
  console.error("❌ Erreur:", error.message);
  await pool.end();
  process.exit(1);
});
