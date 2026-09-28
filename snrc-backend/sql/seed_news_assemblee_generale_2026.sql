-- Actualité : Assemblée Générale de la SNRC du 25 septembre 2026.
-- Idempotent (ON CONFLICT sur le slug) : peut être rejoué sans créer de doublon.
-- Les images sont servies par le frontend : snrc-frontend/public/images/assemblee_generale/

INSERT INTO news (title, slug, summary, content, featured_image, status, published_at)
VALUES (
  'Assemblée Générale de la SNRC présidée par le Secrétaire d’État aux Finances',
  'assemblee-generale-snrc-25-septembre-2026',
  'Le vendredi 25 septembre 2026, la SNRC a tenu son Assemblée Générale dans ses locaux, sous la présidence du Secrétaire d’État aux Finances, M. A. Djadda Kampard, représentant le Ministre d’État en charge des Finances, ministre de tutelle.',
  $content$<p>La Société Nationale de Recouvrement des Créances (SNRC) a tenu son <strong>Assemblée Générale</strong> le <strong>vendredi 25 septembre 2026</strong>, dans ses locaux.</p>
<p>Les travaux étaient présidés par le <strong>Secrétaire d’État aux Finances, M. A. Djadda Kampard</strong>, représentant le Ministre d’État en charge des Finances, ministre de tutelle de la SNRC.</p>
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
<p><img src="/images/assemblee_generale/ag-2026-08.jpg" alt="Les participants suivant les travaux de l’Assemblée Générale" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-09.jpg" alt="Séance de travail de l’Assemblée Générale dans la salle du siège de la SNRC" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-11.jpg" alt="Les membres de l’Assemblée Générale autour de la table de séance" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-10.jpg" alt="Vue d’ensemble de la salle de réunion de la SNRC pendant la séance" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-07.jpg" alt="Participants à l’Assemblée Générale dans la cour de la SNRC" style="width:100%;border-radius:1rem"></p>
<p><img src="/images/assemblee_generale/ag-2026-01.jpg" alt="Accueil des participants à l’entrée des locaux de la SNRC" style="max-width:50%;border-radius:1rem"></p>$content$,
  '/images/assemblee_generale/ag-2026-04.jpg',
  'published',
  '2026-09-25 12:00:00'
)
ON CONFLICT (slug) DO NOTHING;
