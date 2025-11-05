-- Création des tables de base pour TimeOne Dashboard

-- Table des projets
CREATE TABLE IF NOT EXISTS projets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  objectif_quotidien DECIMAL(10,2) NOT NULL DEFAULT 0,
  objectif_mensuel DECIMAL(10,2) NOT NULL DEFAULT 0,
  rentabilite_estimee DECIMAL(10,2) DEFAULT 0,
  solde_rdv INTEGER DEFAULT 0,
  statut VARCHAR(50) DEFAULT 'actif',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des RDV
CREATE TABLE IF NOT EXISTS rdv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projet_id UUID NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  date_heure TIMESTAMP WITH TIME ZONE NOT NULL,
  operateur VARCHAR(255) NOT NULL,
  statut VARCHAR(50) DEFAULT 'en_attente',
  action_id VARCHAR(255),
  type_action VARCHAR(100),
  commission DECIMAL(10,2),
  montant_panier DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des alertes
CREATE TABLE IF NOT EXISTS alertes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projet_id UUID REFERENCES projets(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  action_recommandee TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_rdv_projet_id ON rdv(projet_id);
CREATE INDEX IF NOT EXISTS idx_rdv_date_heure ON rdv(date_heure);
CREATE INDEX IF NOT EXISTS idx_rdv_statut ON rdv(statut);
CREATE INDEX IF NOT EXISTS idx_alertes_projet_id ON alertes(projet_id);
CREATE INDEX IF NOT EXISTS idx_alertes_date ON alertes(date);

-- Trigger pour mettre à jour updated_at sur projets
CREATE OR REPLACE FUNCTION update_projets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projets_updated_at
  BEFORE UPDATE ON projets
  FOR EACH ROW
  EXECUTE FUNCTION update_projets_updated_at();

-- RLS (Row Level Security)
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdv ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertes ENABLE ROW LEVEL SECURITY;

-- Politiques pour projets
CREATE POLICY "Permettre lecture projets" ON projets FOR SELECT USING (true);
CREATE POLICY "Permettre insertion projets" ON projets FOR INSERT WITH CHECK (true);
CREATE POLICY "Permettre mise à jour projets" ON projets FOR UPDATE USING (true);
CREATE POLICY "Permettre suppression projets" ON projets FOR DELETE USING (true);

-- Politiques pour rdv
CREATE POLICY "Permettre lecture rdv" ON rdv FOR SELECT USING (true);
CREATE POLICY "Permettre insertion rdv" ON rdv FOR INSERT WITH CHECK (true);
CREATE POLICY "Permettre mise à jour rdv" ON rdv FOR UPDATE USING (true);
CREATE POLICY "Permettre suppression rdv" ON rdv FOR DELETE USING (true);

-- Politiques pour alertes
CREATE POLICY "Permettre lecture alertes" ON alertes FOR SELECT USING (true);
CREATE POLICY "Permettre insertion alertes" ON alertes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permettre mise à jour alertes" ON alertes FOR UPDATE USING (true);
CREATE POLICY "Permettre suppression alertes" ON alertes FOR DELETE USING (true);
