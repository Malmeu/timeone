-- TimeOne Database Schema
-- Dashboard de Suivi & Optimisation Projets

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: projets
-- Gestion des projets avec objectifs et rentabilité
CREATE TABLE IF NOT EXISTS projets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  objectif_mensuel INTEGER NOT NULL CHECK (objectif_mensuel > 0),
  objectif_quotidien INTEGER NOT NULL CHECK (objectif_quotidien > 0),
  solde_rdv INTEGER NOT NULL DEFAULT 0,
  rentabilite_estimee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: rdv
-- Enregistrement des rendez-vous réalisés
CREATE TABLE IF NOT EXISTS rdv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projet_id UUID NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  date_heure TIMESTAMP WITH TIME ZONE NOT NULL,
  operateur VARCHAR(255) NOT NULL,
  statut VARCHAR(50) NOT NULL DEFAULT 'realise',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: planning
-- Gestion des créneaux horaires et attributions
CREATE TABLE IF NOT EXISTS planning (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creneau_debut TIME NOT NULL,
  creneau_fin TIME NOT NULL,
  projet_id UUID REFERENCES projets(id) ON DELETE SET NULL,
  taux_avancement DECIMAL(5, 2) NOT NULL DEFAULT 0,
  recommandation TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: alertes
-- Système d'alertes et notifications
CREATE TABLE IF NOT EXISTS alertes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('vert', 'rouge', 'jaune')),
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  action_recommandee TEXT,
  projet_id UUID REFERENCES projets(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_rdv_projet_id ON rdv(projet_id);
CREATE INDEX IF NOT EXISTS idx_rdv_date_heure ON rdv(date_heure);
CREATE INDEX IF NOT EXISTS idx_planning_date ON planning(date);
CREATE INDEX IF NOT EXISTS idx_planning_projet_id ON planning(projet_id);
CREATE INDEX IF NOT EXISTS idx_alertes_date ON alertes(date);
CREATE INDEX IF NOT EXISTS idx_alertes_projet_id ON alertes(projet_id);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-update du timestamp
CREATE TRIGGER update_projets_updated_at
  BEFORE UPDATE ON projets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer le solde RDV automatiquement
CREATE OR REPLACE FUNCTION update_solde_rdv()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projets
  SET solde_rdv = objectif_mensuel - (
    SELECT COUNT(*)
    FROM rdv
    WHERE projet_id = NEW.projet_id
    AND EXTRACT(MONTH FROM date_heure) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM date_heure) = EXTRACT(YEAR FROM CURRENT_DATE)
  )
  WHERE id = NEW.projet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le solde après insertion d'un RDV
CREATE TRIGGER update_solde_after_rdv_insert
  AFTER INSERT ON rdv
  FOR EACH ROW
  EXECUTE FUNCTION update_solde_rdv();

-- Fonction pour générer des alertes automatiques
CREATE OR REPLACE FUNCTION generate_alert_for_project(
  p_projet_id UUID,
  p_taux_jour DECIMAL,
  p_taux_mois DECIMAL
)
RETURNS VOID AS $$
DECLARE
  v_type VARCHAR(10);
  v_message TEXT;
  v_action TEXT;
  v_projet_nom VARCHAR(255);
BEGIN
  -- Récupérer le nom du projet
  SELECT nom INTO v_projet_nom FROM projets WHERE id = p_projet_id;
  
  -- Déterminer le type d'alerte
  IF p_taux_jour >= 100 THEN
    v_type := 'vert';
    v_message := 'Objectif journalier atteint pour ' || v_projet_nom;
    v_action := 'Continuer sur cette lancée';
  ELSIF p_taux_jour < 70 THEN
    v_type := 'rouge';
    v_message := 'Retard important sur l''objectif journalier pour ' || v_projet_nom || ' (' || ROUND(p_taux_jour, 0) || '%)';
    v_action := 'Prioriser ce projet immédiatement';
  ELSIF p_taux_mois < 70 THEN
    v_type := 'jaune';
    v_message := 'Retard sur l''objectif mensuel pour ' || v_projet_nom || ' (' || ROUND(p_taux_mois, 0) || '%)';
    v_action := 'Augmenter l''effort sur ce projet';
  ELSE
    RETURN; -- Pas d'alerte nécessaire
  END IF;
  
  -- Insérer l'alerte
  INSERT INTO alertes (type, message, date, action_recommandee, projet_id)
  VALUES (v_type, v_message, NOW(), v_action, p_projet_id);
END;
$$ LANGUAGE plpgsql;

-- Données de démonstration
INSERT INTO projets (nom, objectif_mensuel, objectif_quotidien, solde_rdv, rentabilite_estimee)
VALUES 
  ('Projet Alpha', 300, 15, 280, 850.00),
  ('Projet Beta', 200, 10, 150, 650.00),
  ('Projet Gamma', 400, 20, 380, 1200.00)
ON CONFLICT DO NOTHING;

-- Quelques RDV de démonstration pour aujourd'hui
DO $$
DECLARE
  v_projet_id UUID;
BEGIN
  -- Pour Projet Alpha
  SELECT id INTO v_projet_id FROM projets WHERE nom = 'Projet Alpha' LIMIT 1;
  IF v_projet_id IS NOT NULL THEN
    INSERT INTO rdv (projet_id, date_heure, operateur, statut)
    VALUES 
      (v_projet_id, NOW() - INTERVAL '2 hours', 'Opérateur 1', 'realise'),
      (v_projet_id, NOW() - INTERVAL '1 hour', 'Opérateur 2', 'realise'),
      (v_projet_id, NOW() - INTERVAL '30 minutes', 'Opérateur 1', 'realise');
  END IF;
  
  -- Pour Projet Beta
  SELECT id INTO v_projet_id FROM projets WHERE nom = 'Projet Beta' LIMIT 1;
  IF v_projet_id IS NOT NULL THEN
    INSERT INTO rdv (projet_id, date_heure, operateur, statut)
    VALUES 
      (v_projet_id, NOW() - INTERVAL '3 hours', 'Opérateur 3', 'realise'),
      (v_projet_id, NOW() - INTERVAL '1.5 hours', 'Opérateur 2', 'realise');
  END IF;
END $$;

-- Commentaires sur les tables
COMMENT ON TABLE projets IS 'Table principale des projets avec objectifs et rentabilité';
COMMENT ON TABLE rdv IS 'Enregistrement de tous les rendez-vous réalisés par projet';
COMMENT ON TABLE planning IS 'Gestion des créneaux horaires et attribution des projets';
COMMENT ON TABLE alertes IS 'Système d''alertes automatiques basé sur les performances';
