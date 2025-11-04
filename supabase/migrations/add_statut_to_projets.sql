-- Migration: Ajout du champ statut à la table projets
-- Date: 2025-01-04
-- Description: Permet de mettre en pause/reprendre des projets

-- Ajouter la colonne statut
ALTER TABLE projets 
ADD COLUMN IF NOT EXISTS statut VARCHAR(20) NOT NULL DEFAULT 'actif' 
CHECK (statut IN ('actif', 'en_pause', 'termine'));

-- Mettre à jour les projets existants pour qu'ils soient actifs par défaut
UPDATE projets SET statut = 'actif' WHERE statut IS NULL;

-- Commentaire sur la colonne
COMMENT ON COLUMN projets.statut IS 'Statut du projet: actif, en_pause ou termine';
