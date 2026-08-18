-- Migration additive : module Recrutement (Carrières)
-- Ne touche à AUCUNE table ni ligne existante.
-- Sûr à exécuter sur la base de production en une seule fois via phpPgAdmin.

BEGIN;

CREATE TABLE IF NOT EXISTS job_offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    contract_type VARCHAR(50),
    location VARCHAR(150),
    summary TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    application_deadline TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    job_offer_id INTEGER NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    education_level VARCHAR(150),
    cover_letter_text TEXT,
    cover_letter_file VARCHAR(255),
    cv_file VARCHAR(255) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'nouveau',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Page publique "Carrières" (uniquement si elle n'existe pas déjà —
-- n'écrase jamais le contenu si un admin l'a déjà modifié)
INSERT INTO pages (title, slug, summary, content, banner_image, status)
SELECT
  'Carrières',
  'carrieres',
  'Découvrez les offres d''emploi de la SNRC et déposez votre candidature en ligne.',
  '<p>La rubrique Carrières présente les offres d''emploi ouvertes au sein de la Société Nationale de Recouvrement des Créances (SNRC).</p><p>Elle permet aux candidats de consulter les postes disponibles et de déposer leur candidature directement en ligne, avec CV et lettre de motivation.</p>',
  '/images/sections/snrc.png',
  'published'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'carrieres');

COMMIT;

-- Volontairement AUCUNE offre d'emploi d'exemple n'est insérée ici :
-- les offres de démonstration ("Chargé(e) de recouvrement", "Assistant(e)
-- juridique") ne doivent pas apparaître sur le site public en production.
-- Crée les vraies offres depuis /admin/recrutements après la mise en ligne.
