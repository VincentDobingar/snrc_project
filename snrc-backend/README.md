# SNRC Backend

## Installation
```bash
npm install
```

## Database

### Fresh install
`schema.sql` is self-contained (tables, indexes, and seed data) — running it alone is enough for a new database:
```bash
psql -U postgres -d snrc_db -f sql/schema.sql
```

### Upgrading an existing database
If your database was created from an older version of `schema.sql` (e.g. an existing production database, from before `token_version` and `settings_singleton_idx` were folded into `schema.sql`), also apply the migration files once, in addition to (not instead of) your already-applied `schema.sql`:
```bash
psql -U postgres -d snrc_db -f sql/migration_token_version.sql
psql -U postgres -d snrc_db -f sql/migration_indexes.sql
```
Both are idempotent (`IF NOT EXISTS`) and safe to re-run.

## Env
Copy `.env.example` to `.env`

## Create first admin
```bash
npm run create-admin -- --name "Admin SNRC" --email admin@snrc.td --password Admin@123 --role superadmin
```

## Run
```bash
npm run dev
```
