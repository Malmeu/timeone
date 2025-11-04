# Configuration Supabase

## Étapes de configuration

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL du projet et la clé API (anon key)

### 2. Exécuter le schéma SQL

1. Dans le dashboard Supabase, aller dans **SQL Editor**
2. Copier le contenu de `schema.sql`
3. Exécuter le script

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_key
```

### 4. Configurer les politiques RLS (Row Level Security)

Par défaut, les tables sont créées sans RLS. Pour une application de production, vous devriez activer RLS et créer des politiques appropriées.

Exemple pour permettre l'accès public (développement uniquement) :

```sql
-- Désactiver RLS pour le développement (À NE PAS FAIRE EN PRODUCTION)
ALTER TABLE projets DISABLE ROW LEVEL SECURITY;
ALTER TABLE rdv DISABLE ROW LEVEL SECURITY;
ALTER TABLE planning DISABLE ROW LEVEL SECURITY;
ALTER TABLE alertes DISABLE ROW LEVEL SECURITY;
```

Pour la production, créer des politiques RLS appropriées selon vos besoins d'authentification.

## Structure de la base de données

### Table `projets`
- Stocke les informations des projets
- Objectifs mensuels et quotidiens
- Rentabilité estimée
- Solde RDV (mis à jour automatiquement)

### Table `rdv`
- Enregistre tous les rendez-vous réalisés
- Lié à un projet via `projet_id`
- Trigger automatique pour mettre à jour le solde

### Table `planning`
- Gestion des créneaux horaires
- Attribution des projets aux créneaux
- Recommandations automatiques

### Table `alertes`
- Système d'alertes (vert/rouge/jaune)
- Génération automatique basée sur les performances
- Actions recommandées

## Fonctions SQL utiles

### Générer une alerte manuellement

```sql
SELECT generate_alert_for_project(
  'uuid-du-projet',
  75.5,  -- taux journalier
  82.3   -- taux mensuel
);
```

### Voir les statistiques d'un projet

```sql
SELECT 
  p.nom,
  p.objectif_quotidien,
  COUNT(r.id) FILTER (WHERE DATE(r.date_heure) = CURRENT_DATE) as rdv_jour,
  p.objectif_mensuel,
  COUNT(r.id) FILTER (WHERE EXTRACT(MONTH FROM r.date_heure) = EXTRACT(MONTH FROM CURRENT_DATE)) as rdv_mois
FROM projets p
LEFT JOIN rdv r ON r.projet_id = p.id
GROUP BY p.id, p.nom, p.objectif_quotidien, p.objectif_mensuel;
```
