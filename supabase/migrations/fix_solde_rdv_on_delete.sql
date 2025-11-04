-- Migration: Correction du calcul du solde RDV lors de la suppression
-- Date: 2025-01-04
-- Description: Ajoute un trigger pour mettre à jour le solde RDV après suppression

-- Modifier la fonction pour qu'elle fonctionne aussi avec DELETE
CREATE OR REPLACE FUNCTION update_solde_rdv()
RETURNS TRIGGER AS $$
DECLARE
  v_projet_id UUID;
BEGIN
  -- Récupérer le projet_id selon le type d'opération
  IF TG_OP = 'DELETE' THEN
    v_projet_id := OLD.projet_id;
  ELSE
    v_projet_id := NEW.projet_id;
  END IF;

  -- Mettre à jour le solde RDV
  UPDATE projets
  SET solde_rdv = objectif_mensuel - (
    SELECT COUNT(*)
    FROM rdv
    WHERE projet_id = v_projet_id
    AND EXTRACT(MONTH FROM date_heure) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM date_heure) = EXTRACT(YEAR FROM CURRENT_DATE)
  )
  WHERE id = v_projet_id;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS update_solde_after_rdv_insert ON rdv;
DROP TRIGGER IF EXISTS update_solde_after_rdv_delete ON rdv;

-- Créer le trigger pour INSERT
CREATE TRIGGER update_solde_after_rdv_insert
  AFTER INSERT ON rdv
  FOR EACH ROW
  EXECUTE FUNCTION update_solde_rdv();

-- Créer le trigger pour DELETE
CREATE TRIGGER update_solde_after_rdv_delete
  AFTER DELETE ON rdv
  FOR EACH ROW
  EXECUTE FUNCTION update_solde_rdv();

-- Commentaire
COMMENT ON FUNCTION update_solde_rdv() IS 'Met à jour le solde RDV après insertion ou suppression d''un RDV';
