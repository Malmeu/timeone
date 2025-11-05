-- Migration: Ajout des champs financiers dans la table RDV
-- Date: 2025-01-05
-- Description: Ajoute les champs commission et montant panier pour les données TimeOne

-- Ajouter les colonnes financières
ALTER TABLE rdv 
ADD COLUMN IF NOT EXISTS commission DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS montant_panier DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS action_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS type_action VARCHAR(20) DEFAULT 'vente' CHECK (type_action IN ('vente', 'lead'));

-- Créer un index sur action_id pour éviter les doublons
CREATE INDEX IF NOT EXISTS idx_rdv_action_id ON rdv(action_id);

-- Commentaires
COMMENT ON COLUMN rdv.commission IS 'Commission gagnée pour ce RDV (depuis TimeOne)';
COMMENT ON COLUMN rdv.montant_panier IS 'Montant du panier si disponible (depuis TimeOne)';
COMMENT ON COLUMN rdv.action_id IS 'ID de l''action TimeOne (pour éviter les doublons)';
COMMENT ON COLUMN rdv.type_action IS 'Type d''action: vente ou lead';
