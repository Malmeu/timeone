# TimeOne - Dashboard Suivi & Optimisation Projets

Application de gestion intelligente de projets avec suivi des performances, allocation automatique du temps et recommandations basées sur des algorithmes.

## Fonctionnalités

- 📊 Dashboard multi-projets avec indicateurs clés
- 🎯 Suivi des objectifs quotidiens et mensuels
- 🤖 Recommandations automatiques basées sur un algorithme de scoring
- ⚡ Alertes visuelles dynamiques (vert/rouge/jaune)
- 📅 Gestion dynamique du planning
- 📈 Graphiques d'évolution des performances

## Stack Technique

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS (design inspiré d'Apple)
- **Backend**: Supabase (PostgreSQL + API REST)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router

## Installation

1. Cloner le repository
2. Installer les dépendances:
```bash
npm install
```

3. Configurer les variables d'environnement:
```bash
cp .env.example .env
```
Remplir les valeurs Supabase dans `.env`

4. Lancer le serveur de développement:
```bash
npm run dev
```

## Structure du Projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── lib/           # Configuration (Supabase, utils)
├── types/         # Types TypeScript
├── hooks/         # Custom hooks
└── styles/        # Styles globaux
```

## Base de Données

Tables principales:
- **projets**: Gestion des projets
- **rdv**: Enregistrement des RDV
- **planning**: Créneaux horaires et attributions
- **alertes**: Système d'alertes et notifications

## Développement

```bash
npm run dev      # Lancer en mode développement
npm run build    # Build pour production
npm run preview  # Prévisualiser le build
```
