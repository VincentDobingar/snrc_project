#!/usr/bin/env bash
# Construit le frontend et produit une archive prête à téléverser dans cPanel.
#
# ORDRE IMPORTANT : lancez ce script APRÈS avoir exécuté le seed SQL en
# production (phpPgAdmin). Le build génère le sitemap depuis l'API de
# production, et n'y inclura la nouvelle actualité que si elle est déjà en base.
#
# Usage : ./build-cpanel-release.sh
set -euo pipefail
cd "$(dirname "$0")"

SLUG="assemblee-generale-snrc-25-septembre-2026"
API_URL="${API_URL:-https://api.snrc.td/api}"

echo "== Vérification : l'actualité est-elle servie par l'API de production ? =="
if curl -fsS -m 15 "$API_URL/news/$SLUG" | grep -q '"status":"published"'; then
  echo "OK"
else
  echo "L'actualité n'est pas encore visible sur $API_URL." >&2
  echo "Exécutez d'abord le seed SQL en production, puis relancez." >&2
  exit 1
fi

echo "== Build du frontend =="
( cd snrc-frontend && npm ci && npm run build )

echo "== Création de l'archive =="
mkdir -p release
ARCHIVE="release/snrc-frontend-$(date +%Y%m%d-%H%M).zip"
# Python (et non Compress-Archive) pour inclure le fichier caché .htaccess.
python - "$ARCHIVE" <<'PY'
import os, sys, zipfile
root = "snrc-frontend/dist"
with zipfile.ZipFile(sys.argv[1], "w", zipfile.ZIP_DEFLATED) as z:
    for folder, _, files in os.walk(root):
        for name in files:
            path = os.path.join(folder, name)
            z.write(path, os.path.relpath(path, root))
with zipfile.ZipFile(sys.argv[1]) as z:
    assert ".htaccess" in z.namelist(), ".htaccess absent de l'archive"
    print(f"{len(z.namelist())} fichiers, .htaccess inclus")
PY

echo
echo "Archive prête : $ARCHIVE"
echo "À téléverser dans cPanel > Gestionnaire de fichiers, dossier du site (ex. public_html)."
