BEGIN;

-- =========================
-- TABLES
-- =========================

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'admin_editeur',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT,
    banner_image VARCHAR(255),
    meta_title VARCHAR(180),
    meta_description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT,
    icon VARCHAR(100),
    image VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publication_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES publication_categories(id) ON DELETE SET NULL,
    description TEXT,
    file_url VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(180) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(150) NOT NULL DEFAULT 'SNRC',
    site_tagline VARCHAR(255),
    site_description TEXT,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(50),
    contact_phone_secondary VARCHAR(50),
    address TEXT,
    footer_text TEXT,
    logo_url VARCHAR(255),
    favicon_url VARCHAR(255),
    facebook_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    x_url VARCHAR(255),
    youtube_url VARCHAR(255),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    file_size INTEGER NOT NULL,
    media_type VARCHAR(30) NOT NULL,
    uploaded_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

-- Sécurité si la table existait déjà sans ce champ
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS contact_phone_secondary VARCHAR(50);

-- =========================
-- SEED SETTINGS
-- =========================

INSERT INTO settings (
    site_name,
    site_tagline,
    site_description,
    contact_email,
    contact_phone,
    contact_phone_secondary,
    address,
    footer_text
)
SELECT
    'SNRC',
    'Société Nationale de Recouvrement des Créances',
    'Institution dédiée au recouvrement des créances en difficulté et à la contribution à l’assainissement du système financier national.',
    'contact@snrc.td',
    '+235 30 56 52 95',
    '+235 65 53 73 48',
    'N''Djamena, Tchad',
    'La SNRC intervient dans le recouvrement des créances en difficulté, la liquidation amiable, la gestion des créances confiées et les opérations connexes à son objet social.'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- =========================
-- SEED CATEGORIES
-- =========================

INSERT INTO publication_categories (name, slug, description)
VALUES
('Rapports', 'rapports', 'Rapports institutionnels'),
('Communiqués', 'communiques', 'Communiqués officiels'),
('Notes', 'notes', 'Notes et documents divers'),
('Documents officiels', 'documents-officiels', 'Documents administratifs')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

-- =========================
-- SEED PAGES
-- =========================

INSERT INTO pages (title, slug, summary, content, banner_image, status)
VALUES
(
  'Accueil',
  'accueil',
  'Page d''accueil institutionnelle',
  'Page d''accueil institutionnelle de la SNRC.',
  '/images/sections/snrc.png',
  'published'
),
(
  'La SNRC',
  'la-snrc',
  'Présentation générale de la SNRC',
  '<p>La Société Nationale de Recouvrement des Créances (SNRC) a été mise en place dans le cadre d’une réforme orientée vers l’assainissement du système financier national.</p><p>Disposant du privilège du trésor et de l’hypothèque légale sur les immeubles, elle a pour mission de contribuer au recouvrement effectif des créances en difficulté et d’intervenir dans un champ d’action institutionnel clairement défini.</p><p>Ses interventions s’exercent dans le respect du cadre juridique et réglementaire en vigueur, notamment en matière de transfert de créances, de gestion des actifs et de protection des droits des établissements financiers et des débiteurs.</p>',
  '/images/sections/snrc.png',
  'published'
),
(
  'Missions',
  'missions',
  'La SNRC contribue à l’assainissement du système financier national à travers le recouvrement effectif des créances en difficulté.',
  '<p>La Société Nationale de Recouvrement des Créances (SNRC) a pour mission de contribuer à l’assainissement du système financier national à travers le recouvrement effectif des créances en difficulté.</p><p>Ses interventions s’exercent dans le respect du cadre juridique et réglementaire en vigueur, notamment en matière de transfert de créances, de gestion des actifs et de protection des droits des établissements financiers et des débiteurs.</p>',
  '/images/sections/snrc.png',
  'published'
),
(
  'Services',
  'services',
  'La SNRC intervient dans le recouvrement des créances en difficulté, la liquidation amiable d’établissements de crédit, la gestion des créances confiées par l’État et les opérations connexes à son objet social.',
  '<p>La Société Nationale de Recouvrement des Créances (SNRC) intervient dans un cadre institutionnel précis en vue de contribuer à l’assainissement du système financier national.</p><p>Son action couvre notamment le recouvrement des créances en difficulté, la liquidation amiable d’établissements de crédit, la gestion de créances confiées par l’État ainsi que des opérations connexes à son objet social.</p><p>Ces interventions s’exercent dans le respect du cadre juridique et réglementaire en vigueur, notamment en matière de transfert de créances, de gestion des actifs et de protection des droits des établissements financiers et des débiteurs.</p>',
  '/images/sections/snrc.png',
  'published'
),
(
  'Actualités',
  'actualites',
  'Retrouvez dans cette rubrique les informations, annonces et communications institutionnelles récentes de la SNRC.',
  '<p>La rubrique Actualités a vocation à présenter les informations institutionnelles récentes de la SNRC dans un format clair, structuré et accessible.</p><p>Elle permet de suivre les annonces, communications officielles, évolutions organisationnelles et informations utiles liées au mandat et au champ d’intervention de l’institution.</p><p>Cette rubrique s’inscrit dans une logique de transparence, de diffusion maîtrisée de l’information et de lisibilité institutionnelle.</p>',
  '/images/sections/snrc.png',
  'published'
),
(
  'Publications',
  'publications',
  'Retrouvez dans cette rubrique les documents officiels, notes, rapports et publications institutionnelles de la SNRC.',
  '<p>La rubrique Publications a vocation à centraliser les documents institutionnels de la SNRC et à faciliter l’accès à l’information officielle.</p><p>Elle regroupe les rapports, notes, communiqués, documents de référence et autres ressources utiles à la compréhension du mandat, du champ d’intervention et du cadre d’action de l’institution.</p><p>Cette organisation documentaire s’inscrit dans une logique de clarté, de traçabilité et de diffusion de l’information institutionnelle.</p>',
  '/images/sections/snrc.png',
  'published'
),
(
  'Carrières',
  'carrieres',
  'Découvrez les offres d’emploi de la SNRC et déposez votre candidature en ligne.',
  '<p>La rubrique Carrières présente les offres d’emploi ouvertes au sein de la Société Nationale de Recouvrement des Créances (SNRC).</p><p>Elle permet aux candidats de consulter les postes disponibles et de déposer leur candidature directement en ligne, avec CV et lettre de motivation.</p>',
  '/images/sections/snrc.png',
  'published'
),
(
  'Contact',
  'contact',
  'Prenez contact avec la SNRC pour toute demande d’information, communication officielle ou besoin d’orientation institutionnelle.',
  '<p>La page Contact permet d’entrer en relation avec la Société Nationale de Recouvrement des Créances (SNRC) pour toute demande d’information, correspondance officielle ou orientation institutionnelle.</p><p>Elle s’inscrit dans une logique de communication claire, de collaboration active et d’accès structuré à l’information institutionnelle.</p><p>Les demandes transmises via ce canal sont destinées à faciliter les échanges avec les partenaires, institutions et parties prenantes concernées.</p>',
  '/images/sections/snrc.png',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    banner_image = EXCLUDED.banner_image,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;

-- =========================
-- SEED SERVICES
-- =========================

INSERT INTO services (title, slug, summary, content, icon, image, display_order, status)
VALUES
(
  'Recouvrement des créances en difficulté',
  'recouvrement-creances-difficulte',
  'Recouvrement contre rémunération des créances douteuses, litigieuses et/ou contentieuses détenues par les institutions financières publiques et privées.',
  'La SNRC intervient dans le recouvrement des créances en difficulté sur demande ou après approbation formelle de l’État à travers le Ministre en charge des finances.',
  'landmark',
  '/images/sections/snrc.png',
  1,
  'published'
),
(
  'Liquidation amiable d’établissements de crédit',
  'liquidation-amiable-etablissements-credit',
  'Liquidation de tout ou partie des actifs et du passif d’un établissement de crédit confiée par l’autorité de tutelle, la COBAC ou les tribunaux.',
  'La SNRC peut intervenir dans la liquidation amiable d’établissements de crédit publics ou privés conformément au cadre juridique applicable.',
  'scale',
  '/images/sections/snrc.png',
  2,
  'published'
),
(
  'Gestion des créances confiées par l’État',
  'gestion-creances-confiees-etat',
  'Gestion de toute créance confiée par l’État, qu’elle soit bancaire ou issue d’une entité financière ou non, du secteur parapublic, privé ou d’une entreprise non financière publique.',
  'La SNRC assure la gestion des créances qui lui sont confiées par l’État dans un cadre structuré et institutionnel.',
  'file-text',
  '/images/sections/snrc.png',
  3,
  'published'
),
(
  'Opérations connexes à l’objet social',
  'operations-connexes-objet-social',
  'Participation directe ou indirecte à des activités ou opérations commerciales, financières ou mobilières rattachées directement ou indirectement à l’objet social de la SNRC.',
  'La SNRC peut prendre part à des opérations connexes lorsque celles-ci se rattachent directement ou indirectement à son objet social.',
  'briefcase',
  '/images/sections/snrc.png',
  4,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    icon = EXCLUDED.icon,
    image = EXCLUDED.image,
    display_order = EXCLUDED.display_order,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;

-- =========================
-- SEED FAQS
-- =========================

INSERT INTO faqs (question, answer, display_order, status)
SELECT
  'À quoi sert le site de la SNRC ?',
  'Le site permet de présenter l’institution, ses missions, ses domaines d’intervention, ses actualités et ses publications officielles.',
  1,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM faqs WHERE question = 'À quoi sert le site de la SNRC ?'
);

INSERT INTO faqs (question, answer, display_order, status)
SELECT
  'Comment contacter la SNRC ?',
  'Les coordonnées et le formulaire de contact sont accessibles sur la page Contact.',
  2,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM faqs WHERE question = 'Comment contacter la SNRC ?'
);

INSERT INTO faqs (question, answer, display_order, status)
SELECT
  'Où consulter les documents officiels ?',
  'Les rapports, notes et documents institutionnels sont disponibles dans la rubrique Publications.',
  3,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM faqs WHERE question = 'Où consulter les documents officiels ?'
);

-- =========================
-- SEED NEWS
-- =========================

INSERT INTO news (title, slug, summary, content, featured_image, status, published_at)
VALUES
(
  'Lancement du site institutionnel SNRC',
  'lancement-site-institutionnel-snrc',
  'La SNRC renforce sa présence numérique institutionnelle.',
  'Contenu complet de l’actualité sur le lancement du site institutionnel de la SNRC.',
  '/images/news/news-1.png',
  'published',
  NOW()
),
(
  'Publication d’un nouveau communiqué',
  'publication-nouveau-communique',
  'Les informations officielles de la SNRC sont désormais centralisées sur le site.',
  'Contenu complet du communiqué institutionnel.',
  '/images/news/news-2.png',
  'published',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    featured_image = EXCLUDED.featured_image,
    status = EXCLUDED.status,
    published_at = EXCLUDED.published_at,
    updated_at = CURRENT_TIMESTAMP;

-- =========================
-- SEED JOB OFFERS
-- =========================

INSERT INTO job_offers (title, slug, contract_type, location, summary, description, requirements, application_deadline, status, published_at)
VALUES
(
  'Chargé(e) de recouvrement',
  'charge-de-recouvrement',
  'CDI',
  'N’Djamena, Tchad',
  'La SNRC recrute un(e) chargé(e) de recouvrement pour renforcer son équipe opérationnelle.',
  '<p>Sous l’autorité de la direction des opérations, le/la chargé(e) de recouvrement assure le suivi et la gestion des dossiers de créances qui lui sont confiés.</p><p>Il/elle participe à l’élaboration des stratégies de recouvrement amiable et contentieux et assure le reporting régulier de son activité.</p>',
  '<ul><li>Formation supérieure en droit, finance ou gestion (Bac+3 minimum)</li><li>Expérience en recouvrement de créances appréciée</li><li>Rigueur, sens de l’organisation et bonne capacité rédactionnelle</li></ul>',
  NOW() + INTERVAL '60 days',
  'published',
  NOW()
),
(
  'Assistant(e) juridique',
  'assistant-juridique',
  'CDD',
  'N’Djamena, Tchad',
  'La SNRC recrute un(e) assistant(e) juridique pour accompagner le service contentieux.',
  '<p>L’assistant(e) juridique apporte un appui administratif et documentaire au service contentieux dans le traitement des dossiers de recouvrement judiciaire.</p><p>Il/elle participe à la préparation des pièces de procédure et au suivi des échéances judiciaires.</p>',
  '<ul><li>Formation en droit (Bac+2 minimum)</li><li>Maîtrise des outils bureautiques</li><li>Discrétion et rigueur dans le traitement des dossiers</li></ul>',
  NOW() + INTERVAL '45 days',
  'published',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    contract_type = EXCLUDED.contract_type,
    location = EXCLUDED.location,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    application_deadline = EXCLUDED.application_deadline,
    status = EXCLUDED.status,
    published_at = EXCLUDED.published_at,
    updated_at = CURRENT_TIMESTAMP;

COMMIT;