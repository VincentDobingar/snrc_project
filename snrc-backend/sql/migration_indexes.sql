-- NOTE : ces index sont désormais également inclus directement dans
-- schema.sql, pour qu'une installation fraîche (schema.sql seul, comme
-- documenté dans le README) obtienne un schéma complet dès le départ. Ce
-- fichier est conservé uniquement pour mettre à niveau une base de données
-- EXISTANTE créée à partir d'une version antérieure de schema.sql qui ne les
-- contenait pas encore (ex : la production).
CREATE INDEX IF NOT EXISTS idx_job_applications_job_offer_id ON job_applications(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_publications_category_id ON publications(category_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
