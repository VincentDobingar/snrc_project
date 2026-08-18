# SNRC Backend

## Installation
```bash
npm install
```

## Database
```bash
psql -U postgres -d snrc_db -f sql/schema.sql
```

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
