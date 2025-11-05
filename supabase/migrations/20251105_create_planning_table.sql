-- Création de la table planning pour gérer les créneaux horaires
CREATE TABLE IF NOT EXISTS planning (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projet_id UUID REFERENCES projets(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  creneau_debut TIME NOT NULL,
  creneau_fin TIME NOT NULL,
  recommandation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_planning_date ON planning(date);
CREATE INDEX IF NOT EXISTS idx_planning_projet_id ON planning(projet_id);
CREATE INDEX IF NOT EXISTS idx_planning_date_projet ON planning(date, projet_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_planning_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER planning_updated_at
  BEFORE UPDATE ON planning
  FOR EACH ROW
  EXECUTE FUNCTION update_planning_updated_at();

-- RLS (Row Level Security)
ALTER TABLE planning ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire
CREATE POLICY "Permettre lecture planning" ON planning
  FOR SELECT
  USING (true);

-- Politique : Tout le monde peut insérer
CREATE POLICY "Permettre insertion planning" ON planning
  FOR INSERT
  WITH CHECK (true);

-- Politique : Tout le monde peut mettre à jour
CREATE POLICY "Permettre mise à jour planning" ON planning
  FOR UPDATE
  USING (true);

-- Politique : Tout le monde peut supprimer
CREATE POLICY "Permettre suppression planning" ON planning
  FOR DELETE
  USING (true);

-- Commentaires
COMMENT ON TABLE planning IS 'Table pour gérer les créneaux horaires de travail par projet';
COMMENT ON COLUMN planning.projet_id IS 'Référence au projet associé';
COMMENT ON COLUMN planning.date IS 'Date du créneau';
COMMENT ON COLUMN planning.creneau_debut IS 'Heure de début du créneau';
COMMENT ON COLUMN planning.creneau_fin IS 'Heure de fin du créneau';
COMMENT ON COLUMN planning.recommandation IS 'Recommandation IA pour ce créneau';
