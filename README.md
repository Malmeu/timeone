# TimeOne Dashboard 🚀

Dashboard de Suivi & Optimisation de Projets - Application complète de gestion multi-projets avec suivi en temps réel, algorithme de scoring intelligent, système d'alertes automatiques et authentification Supabase.

## ✨ Fonctionnalités Complètes

### 🔐 Authentification
- **Connexion/Inscription** avec Supabase Auth
- **Protection des routes** avec ProtectedRoute
- **Gestion des sessions** avec localStorage
- **Confirmation d'email** obligatoire
- **Déconnexion** sécurisée

### 📊 Dashboard Multi-Projets
- Vue d'ensemble avec statistiques globales (jour/mois)
- 8 projets réels : Canal+, Danone, EBP, Hyundai, Quadra, Sage PE, Ayvens, 6XPOS
- Cartes de projets avec indicateurs de performance en temps réel
- Système d'alertes visuelles (vert/rouge/jaune)
- Recommandation IA du **projet le moins avancé** pour priorisation

### 🤖 Algorithme de Scoring Intelligent
- Calcul basé sur 3 critères pondérés :
  - Retard accumulé (40%)
  - Rentabilité (30%)
  - Volume restant (30%)
- Recommandation du projet nécessitant le plus d'attention
- Génération de raisons explicatives contextualisées

### 📅 Gestion des RDV
- **Ajout manuel** de RDV (dates passées, présentes, futures)
- **Modal plein écran** pour visualiser tous les RDV d'un projet
- **Modification en ligne** : date/heure, opérateur, statut
- **Suppression** avec confirmation
- **Badges de statut** colorés (Réalisé/Planifié/Annulé)

### 🗓 Planning Dynamique
- Affichage des créneaux horaires avec projets assignés
- Sélecteur de date pour navigation
- Calcul automatique des taux d'avancement par créneau
- **Recommandations détaillées** pour chaque créneau :
  - 08h-10h : Hyundai (volume important)
  - 10h-12h : EBP, Sage PE, Quadra, 6XPOS
  - 13h-15h : Canal+, Danone
  - 15h-17h : Ayvens (rattrapage)

### 🔔 Système de Notifications
- **Centre de notifications** accessible via icône cloche
- **Bannières** qui apparaissent automatiquement
- **Notifications d'objectifs atteints** (100% journalier)
- **Alertes horaires automatiques** :
  - 11h : Si < 50% (avant pause)
  - 15h : Si < 100% (2h restantes)
  - 16h30 : Si < 90% (dernière demi-heure)
- Historique des 50 dernières notifications
- Marquage comme lu/non lu

### 🗄 Base de Données Supabase
- **4 tables** : projets, rdv, planning, alertes
- **Triggers automatiques** pour mise à jour du solde
- **Fonction SQL** pour calcul des progressions
- **Fonction de génération d'alertes** contextualisées
- **Index** pour optimisation des performances
- **8 projets réels** avec objectifs quotidiens décimaux

## 🛠 Stack Technique

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS avec design Apple-like
- **Backend**: Supabase (PostgreSQL + Auth + API REST)
- **Routing**: React Router v6 avec routes protégées
- **State Management**: React Context (Notifications)
- **Icons**: Lucide React
- **Date Formatting**: date-fns avec locale française
- **Animations**: CSS animations personnalisées

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd TimeOne

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos identifiants Supabase

# Lancer le serveur de développement
npm run dev
```

## 🔧 Configuration Supabase

### 1. Créer le projet
```bash
# Le projet "TimeOne Dashboard" est déjà créé
# ID: xfnnqipubzlyexkokvqe
# Région: eu-west-3 (Paris)
```

### 2. Base de données
```bash
# Les migrations sont déjà appliquées :
# - create_tables_structure
# - create_functions_and_triggers
# - insert_demo_data
# - modify_objectif_quotidien_to_decimal
# - add_function_calculate_planning_progress
```

### 3. Authentification
```bash
# L'authentification email est activée par défaut
# Créer un compte via /register
# Confirmer l'email reçu
# Se connecter via /login
```

### 4. Variables d'environnement
```env
VITE_SUPABASE_URL=https://xfnnqipubzlyexkokvqe.supabase.co
VITE_SUPABASE_ANON_KEY=<votre_clé_anon>
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Développement (port 5174)
npm run build    # Build pour production
npm run preview  # Prévisualiser le build
npm run lint     # Linter ESLint
```

## 📊 Structure du Projet

```
TimeOne/
├── src/
│   ├── components/           # Composants réutilisables
│   │   ├── Layout.tsx       # Layout avec sidebar et header
│   │   ├── ProjectCard.tsx  # Carte de projet avec RDV
│   │   ├── AlertCard.tsx    # Carte d'alerte
│   │   ├── RdvListModal.tsx # Modal RDV plein écran
│   │   ├── AddRdvModal.tsx  # Modal ajout RDV
│   │   ├── NotificationCenter.tsx  # Centre de notifications
│   │   └── ProtectedRoute.tsx      # Protection des routes
│   ├── pages/               # Pages de l'application
│   │   ├── Login.tsx        # Page de connexion
│   │   ├── Register.tsx     # Page d'inscription
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── Projects.tsx     # Gestion des projets
│   │   └── Planning.tsx     # Planning dynamique
│   ├── hooks/               # Custom hooks
│   │   ├── useProjects.ts   # Fetch projets avec stats
│   │   ├── useAlertes.ts    # Fetch alertes
│   │   ├── usePlanning.ts   # Fetch planning
│   │   └── useNotificationMonitor.ts  # Surveillance notifications
│   ├── contexts/            # Contextes React
│   │   └── NotificationContext.tsx    # Gestion globale notifications
│   ├── lib/                 # Utilitaires et config
│   │   ├── supabase.ts      # Client Supabase
│   │   ├── utils.ts         # Fonctions utilitaires
│   │   └── scoring.ts       # Algorithme de scoring
│   └── types/               # Types TypeScript
│       ├── database.ts      # Types Supabase
│       └── index.ts         # Types métier
├── supabase/                # Configuration BDD
│   ├── schema.sql           # Schéma complet
│   └── README.md            # Documentation BDD
└── package.json
```

## 🎨 Design

Interface minimaliste inspirée d'Apple avec :
- **Effets de verre** (glass-effect) avec backdrop-blur
- **Animations fluides** (slide-in, blob, transitions)
- **Codes couleur intuitifs** (vert/jaune/rouge)
- **Responsive design** adaptatif
- **Typographie** SF Pro Display
- **Ombres portées** subtiles
- **Coins arrondis** harmonieux

## 🚀 Fonctionnalités Avancées

### Algorithme de Recommandation
```typescript
// Recommande le projet le moins avancé
const progressScore = tauxJour * 0.7 + tauxMois * 0.3
// Plus le score est bas, plus le projet est prioritaire
```

### Calcul Automatique des Progressions
```sql
-- Fonction SQL pour calculer le taux d'avancement d'un créneau
calculate_planning_progress(planning_id)
-- Compte les RDV dans le créneau / objectif quotidien * 100
```

### Système de Notifications Intelligent
```typescript
// Vérification toutes les 2 minutes
// Évite les doublons avec système de cache
// Bannières auto-supprimées après 5 secondes
```

## 📱 Pages de l'Application

### `/login` - Connexion
- Formulaire email/mot de passe
- Authentification Supabase
- Animations blob en arrière-plan
- Lien vers inscription

### `/register` - Inscription
- Formulaire complet avec validation
- Confirmation d'email requise
- Message de succès avec redirection

### `/dashboard` - Dashboard Principal
- Statistiques globales
- Liste des projets avec progression
- Recommandation IA
- Alertes récentes
- Bouton ajout RDV

### `/projects` - Gestion des Projets
- Liste complète des 8 projets
- Bouton "Voir RDV" sur chaque carte
- Modal plein écran pour gérer les RDV
- Ajout/modification/suppression de RDV

### `/planning` - Planning Dynamique
- Créneaux horaires avec progression
- Sélecteur de date
- Recommandations par créneau
- Codes couleur par statut

## 🔒 Sécurité

- ✅ Authentification Supabase avec JWT
- ✅ Mots de passe hashés (bcrypt)
- ✅ Protection des routes côté client
- ✅ Confirmation d'email obligatoire
- ✅ Sessions sécurisées avec localStorage
- ✅ Déconnexion propre

## 📈 Prochaines Améliorations Possibles

- [ ] Graphiques d'évolution avec Recharts
- [ ] Export de données (CSV/JSON)
- [ ] Notifications push en temps réel
- [ ] Mode sombre
- [ ] Gestion des équipes et permissions
- [ ] Rapports mensuels automatiques
- [ ] Intégration calendrier externe
- [ ] Application mobile (React Native)

## 🐛 Dépannage

### Erreur de connexion Supabase
- Vérifier les variables d'environnement dans `.env`
- Vérifier que le projet Supabase est actif
- Vérifier la connexion internet

### Erreur TypeScript sur RdvListModal
- Erreur de typage Supabase connue (ligne 85)
- Contournée avec `@ts-ignore`
- N'affecte pas le fonctionnement

### Notifications ne s'affichent pas
- Vérifier que le hook `useNotificationMonitor` est appelé
- Vérifier la console pour les erreurs
- Les notifications apparaissent selon les horaires (11h, 15h, 16h30)

## 📄 Licence

© 2025 TimeOne. Tous droits réservés.

---

**Développé avec ❤️ en utilisant React, TypeScript, Supabase et TailwindCSS** et attributions
- **alertes**: Système d'alertes et notifications

## Développement

```bash
npm run dev      # Développement (port 5174)
npm run build    # Build pour production
npm run preview  # Prévisualiser le build
```
