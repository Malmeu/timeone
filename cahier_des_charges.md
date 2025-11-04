Cahier des charges — Dashboard Suivi & Optimisation Projets
1. Objectif de l’application
Créer une plateforme centrale pour :

Suivi quotidien et mensuel des performances de chaque projet (RDV réalisés, objectifs atteints).

Allocation intelligente du temps sur la journée selon l’avancement et les priorités.

Recommandation automatique du projet à traiter selon les objectifs atteints, les retards, ou la rentabilité.

Visualisation graphique et alertes visuelles sur l’état des projets.

2. Principales fonctionnalités à développer
2.1. Tableau de bord multi-projets
Vue synthétique : Liste des projets, avec indicateurs clés (objectif mensuel, objectif quotidien, RDV réalisés, solde restant).

Barres de progression par projet, pourcentage atteint sur la journée et le mois.

Graphiques d'évolution mensuelle des RDV réalisés.

Filtrage par période (jour/mois) et par projet.

2.2. Gestion dynamique de planning
Répartition horaire optimisée : pour chaque créneau de la journée, affichage des projets recommandés selon l’état d’avancement.

Automatisation de l’affectation des créneaux : l’algorithme propose le projet à travailler (si retard, priorité accrue).

Propositions intelligentes : suggestion contextualisée du projet à traiter selon les objectifs, retard accumulé, ou rentabilité.

2.3. Suivi des objectifs & Alertes
Compteurs automatiques : Actualisation du nombre de RDV réalisés/objectif (jour et mois).

Alertes visuelles dynamiques :

Vert : Objectif du jour atteint

Rouge : Objectif du jour dépassé

Jaune : Retard accumulé (ex : taux d’avancement < seuil paramétrable, exemple 70%)

Système de notification pour guider les opérateurs sur la répartition du travail.

3. Structure de données (exemple)
Table Projets : nom, objectif mensuel, objectif quotidien, solde RDV, rentabilité estimée

Table RDV : projet associé, date/heure, opérateur, statut

Table Planning : créneaux horaires, attribution projet, taux d’avancement, recommandations

Table Alertes : type (vert/rouge/jaune), message, date, action recommandée

4. Algorithmes/core logic
Calcul du solde restant pour chaque projet en temps réel.

Système de scoring/proposition : algorithme qui compare état vs objectif et propose automatiquement le projet à prioriser selon :

Retard accumulé

Rentabilité

Volume restant à atteindre sur la période

Génération des alertes et notifications selon le taux d’avancement.

5. Interface utilisateur (UX/UI)
design inspiré de APPLE avec un style minimaliste et clair et moderne

Dashboard graphique, barre de progression, codes couleur, animations pour meilleure visibilité.

Section dédiée aux recommandations de travail (projets à traiter à l’instant T).

Filtres et accès rapide à l’historique (par jour/mois/projet).

Zone affichage des alertes et consignes d’action.

6. Exigences techniques pour Windsurf
Modularité du code pour ajout/suppression simple de projets.

Système de paramétrage flexible (objectifs, seuils d’avancement, planning des créneaux).

API REST pour intégrations externes (import/export données : CSV, JSON…)

Logging/monitoring en temps réel des changements et recommandations.