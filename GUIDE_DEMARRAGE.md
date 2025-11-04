# Guide de Démarrage - TimeOne Dashboard

## 🚀 Démarrage Rapide

### 1. Configuration Supabase

**Créer un projet Supabase :**

1. Aller sur [supabase.com](https://supabase.com) et créer un compte
2. Créer un nouveau projet
3. Noter l'URL du projet et la clé API (anon key)

**Exécuter le schéma SQL :**

1. Dans le dashboard Supabase, aller dans **SQL Editor**
2. Copier le contenu du fichier `supabase/schema.sql`
3. Cliquer sur "Run" pour exécuter le script
4. Vérifier que les tables sont créées dans l'onglet **Table Editor**

**Désactiver RLS pour le développement :**

Dans le SQL Editor, exécuter :

```sql
ALTER TABLE projets DISABLE ROW LEVEL SECURITY;
ALTER TABLE rdv DISABLE ROW LEVEL SECURITY;
ALTER TABLE planning DISABLE ROW LEVEL SECURITY;
ALTER TABLE alertes DISABLE ROW LEVEL SECURITY;
```

### 2. Configuration de l'application

**Créer le fichier `.env` :**

```bash
cp .env.example .env
```

**Éditer `.env` avec vos identifiants Supabase :**

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_key_ici
```

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📋 Fonctionnalités Implémentées

### ✅ Dashboard Principal
- Vue d'ensemble des projets
- Statistiques globales (objectifs jour/mois)
- Cartes de projets avec barres de progression
- Système d'alertes visuelles (vert/rouge/jaune)
- Recommandation IA du projet prioritaire

### ✅ Algorithme de Scoring
- Calcul automatique basé sur :
  - Retard accumulé (40%)
  - Rentabilité (30%)
  - Volume restant (30%)
- Génération de raisons explicatives

### ✅ Gestion des Projets
- Liste de tous les projets
- Indicateurs de performance en temps réel
- Calcul automatique des taux d'avancement

### ✅ Base de Données Supabase
- 4 tables : projets, rdv, planning, alertes
- Triggers automatiques pour mise à jour du solde
- Fonction de génération d'alertes
- Données de démonstration incluses

### 🚧 À Implémenter
- Page Planning avec vue calendrier
- Formulaire d'ajout/modification de projets
- Formulaire d'ajout de RDV
- Graphiques d'évolution (Recharts)
- Export de données (CSV/JSON)
- Authentification utilisateur

## 🎨 Design

L'interface utilise un design minimaliste inspiré d'Apple avec :
- TailwindCSS pour le styling
- Effets de verre (glass-effect)
- Animations fluides
- Codes couleur intuitifs
- Icônes Lucide React

## 📊 Structure du Projet

```
TimeOne/
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Layout.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── AlertCard.tsx
│   │   └── RecommendationCard.tsx
│   ├── pages/          # Pages de l'application
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   └── Planning.tsx
│   ├── hooks/          # Custom hooks
│   │   ├── useProjects.ts
│   │   └── useAlertes.ts
│   ├── lib/            # Utilitaires et config
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   │   └── scoring.ts
│   └── types/          # Types TypeScript
│       ├── database.ts
│       └── index.ts
├── supabase/           # Configuration BDD
│   ├── schema.sql
│   └── README.md
└── package.json
```

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

## 📝 Prochaines Étapes

1. **Configurer Supabase** avec vos identifiants
2. **Tester l'application** avec les données de démonstration
3. **Ajouter vos propres projets** via l'interface
4. **Personnaliser** les objectifs et paramètres
5. **Implémenter** les fonctionnalités manquantes selon vos besoins

## 🐛 Dépannage

**Erreur de connexion Supabase :**
- Vérifier que les variables d'environnement sont correctes dans `.env`
- Vérifier que le schéma SQL a été exécuté
- Vérifier que RLS est désactivé pour le développement

**Erreur de build :**
- Supprimer `node_modules` et réinstaller : `rm -rf node_modules && npm install`
- Vérifier la version de Node.js (>= 18 recommandé)

**Données de démonstration manquantes :**
- Réexécuter le script `supabase/schema.sql` complet

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation React](https://react.dev)
- [Documentation TailwindCSS](https://tailwindcss.com)
- [Documentation Vite](https://vitejs.dev)

---

**Bon développement ! 🚀**
