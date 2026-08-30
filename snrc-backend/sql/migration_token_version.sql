-- Ajoute un compteur de version de jeton (token_version) aux admins, permettant
-- de révoquer immédiatement tous les JWT déjà émis pour un compte (changement de
-- mot de passe, désactivation, changement de rôle) sans attendre leur expiration.
ALTER TABLE admins ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

-- Garantit qu'il ne peut jamais exister plus d'une ligne dans settings, même en
-- cas d'écritures concurrentes lors de la toute première initialisation.
CREATE UNIQUE INDEX IF NOT EXISTS settings_singleton_idx ON settings ((true));
