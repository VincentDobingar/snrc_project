-- Actualités de fin septembre 2026 à la SNRC (deux événements distincts) :
--   1. Assemblée Générale du jeudi 24 septembre 2026 (photos ag-2026-01 à 06)
--   2. Conseil d'Administration du vendredi 25 septembre 2026 (photos ag-2026-07 à 11)
--
-- Idempotent : peut être rejoué sans créer de doublon (ON CONFLICT sur le slug).
-- Les images sont servies par le frontend : snrc-frontend/public/images/assemblee_generale/
--
-- Une première version de ce script publiait les deux réunions dans une seule
-- actualité datée du 25 septembre (slug ci-dessous). Le DELETE la retire là où
-- elle a déjà été insérée ; sur une base neuve il ne fait rien.

BEGIN;

DELETE FROM news WHERE slug = 'assemblee-generale-snrc-25-septembre-2026';

-- 1. Assemblée Générale (jeudi 24 septembre 2026)
INSERT INTO news (title, slug, summary, content, featured_image, status, published_at)
VALUES (
  'Assemblée Générale de la SNRC présidée par le Secrétaire d’État aux Finances et au Budget',
  'assemblee-generale-snrc-24-septembre-2026',
  'Le jeudi 24 septembre 2026, la SNRC a tenu son Assemblée Générale dans ses locaux, sous la présidence du Secrétaire d’État aux Finances et au Budget, M. Ali Djadda Kampard, représentant le Ministre d’État en charge des Finances, ministre de tutelle.',
  $content$<p>La Société Nationale de Recouvrement des Créances (SNRC) a tenu son <strong>Assemblée Générale</strong> le <strong>jeudi 24 septembre 2026</strong>, dans ses locaux.</p>
<p>Les travaux étaient présidés par le <strong>Secrétaire d’État aux Finances et au Budget, M. Ali Djadda Kampard</strong>, représentant le Ministre d’État en charge des Finances, ministre de tutelle de la SNRC.</p>
<h2>Les membres présents</h2>
<p>Cette Assemblée Générale a réuni les représentants des institutions membres :</p>
<ul>
<li>la Présidence ;</li>
<li>la Primature ;</li>
<li>le Ministère de la Justice ;</li>
<li>le Secrétariat Général du Gouvernement (SGG) ;</li>
<li>la Banque des États de l’Afrique Centrale (BEAC).</li>
</ul>
<h2>En images</h2>
<p><img src="/images/assemblee_generale/ag-2026-06.jpg" alt="Photo de groupe des participants à l’Assemblée Générale de la SNRC devant les locaux" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-02.jpg" alt="Échanges entre les participants à leur arrivée aux locaux de la SNRC" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-03.jpg" alt="Les membres de l’Assemblée Générale installés en salle de réunion" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-05.jpg" alt="Vue de la table de séance pendant l’Assemblée Générale" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-01.jpg" alt="Accueil des participants à l’entrée des locaux de la SNRC" style="max-width:50%;border-radius:1rem"></p>$content$,
  '/images/assemblee_generale/ag-2026-04.jpg',
  'published',
  '2026-09-24 12:00:00'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Conseil d'Administration (vendredi 25 septembre 2026)
INSERT INTO news (title, slug, summary, content, featured_image, status, published_at)
VALUES (
  'Conseil d’Administration de la SNRC présidé par M. Dady Hassane Guero',
  'conseil-administration-snrc-25-septembre-2026',
  'Le vendredi 25 septembre 2026, le Conseil d’Administration de la SNRC s’est réuni dans les locaux de la société, sous la présidence de son Président, M. Dady Hassane Guero.',
  $content$<p>Le <strong>Conseil d’Administration</strong> de la Société Nationale de Recouvrement des Créances (SNRC) s’est réuni le <strong>vendredi 25 septembre 2026</strong>, dans les locaux de la société.</p>
<p>La séance était présidée par le <strong>Président du Conseil d’Administration, M. Dady Hassane Guero</strong>.</p>
<h2>En images</h2>
<p><img src="/images/assemblee_generale/ag-2026-07.jpg" alt="Membres du Conseil d’Administration de la SNRC réunis dans la cour des locaux" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-09.jpg" alt="Séance du Conseil d’Administration dans la salle de réunion de la SNRC" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-11.jpg" alt="Les administrateurs autour de la table de séance" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-10.jpg" alt="Vue d’ensemble de la salle de réunion pendant le Conseil d’Administration" style="width:100%;border-radius:1rem"></p>$content$,
  '/images/assemblee_generale/ag-2026-08.jpg',
  'published',
  '2026-09-25 12:00:00'
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
