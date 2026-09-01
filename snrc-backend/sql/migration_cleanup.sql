-- Aligne le vocabulaire de statut des messages sur celui des candidatures
-- (job_applications), qui a toujours utilisé "nouveau"/"lu". Les lignes déjà
-- en base avec l'ancien vocabulaire anglais ("new"/"read") sont converties ;
-- schema.sql a été mis à jour pour que les nouvelles lignes utilisent
-- directement le bon vocabulaire.
UPDATE messages SET status = 'nouveau' WHERE status = 'new';
UPDATE messages SET status = 'lu' WHERE status = 'read';

-- La table "media" n'a jamais été utilisée par aucun modèle/contrôleur :
-- chaque ressource stocke ses chemins de fichiers dans ses propres colonnes.
-- Supprimée de schema.sql pour les installations fraîches ; à exécuter ici
-- pour une base existante, seulement après avoir confirmé qu'elle est bien
-- vide (aucune donnée n'y a jamais été écrite par l'application).
DROP TABLE IF EXISTS media;
