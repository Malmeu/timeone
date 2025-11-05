# 🚀 Intégration API TimeOne - Guide de Déploiement

## ✅ Ce qui a été implémenté

### 1. Supabase Edge Function
**Fichier** : `supabase/functions/sync-timeone-programs/index.ts`

Fonction serverless qui :
- Récupère le flux XML des programmes TimeOne
- Parse les données
- Crée ou met à jour les projets dans votre base de données
- Évite les doublons

### 2. Service Frontend
**Fichier** : `src/services/timeone.ts`

Service TypeScript pour appeler la Edge Function depuis votre application React.

### 3. Interface Utilisateur
**Fichier** : `src/pages/Projects.tsx`

Bouton "Sync TimeOne" avec :
- Icône Download
- Animation de chargement
- Feedback utilisateur
- Gradient violet-bleu pour le distinguer

## 📋 Étapes de Déploiement

### Étape 1 : Installer Supabase CLI

```bash
npm install -g supabase
```

### Étape 2 : Se connecter à Supabase

```bash
supabase login
```

Suivez les instructions pour vous authentifier.

### Étape 3 : Lier votre projet

```bash
cd /Users/Apple/Desktop/TimeOne
supabase link --project-ref VOTRE_PROJECT_REF
```

**Comment trouver votre PROJECT_REF ?**
- Allez sur https://supabase.com/dashboard
- Sélectionnez votre projet TimeOne
- L'URL ressemble à : `https://supabase.com/dashboard/project/VOTRE_PROJECT_REF`
- Copiez la partie après `/project/`

### Étape 4 : Déployer la Edge Function

```bash
supabase functions deploy sync-timeone-programs
```

Vous devriez voir :
```
Deploying sync-timeone-programs (project ref: xxx)
Deployed sync-timeone-programs
```

### Étape 5 : Tester dans l'application

1. Lancez votre application : `npm run dev`
2. Allez sur la page "Projets"
3. Cliquez sur le bouton "Sync TimeOne" (violet-bleu avec icône Download)
4. Attendez la synchronisation
5. Vos programmes TimeOne devraient apparaître comme nouveaux projets !

## 🎯 Utilisation

### Synchronisation Manuelle

1. Cliquez sur **"Sync TimeOne"** dans la page Projets
2. L'application récupère vos programmes actifs depuis TimeOne
3. Les nouveaux programmes sont créés automatiquement
4. Les programmes existants sont mis à jour

### Ce qui est synchronisé

- ✅ Nom du programme
- ✅ ID du programme
- ✅ Description (si disponible)
- ✅ Statut (actif/inactif)

### Valeurs par défaut

Les nouveaux projets créés ont :
- **Objectif mensuel** : 30 RDV
- **Objectif quotidien** : 1 RDV
- **Solde RDV** : 30
- **Rentabilité estimée** : 0€
- **Statut** : actif

Vous pouvez modifier ces valeurs après l'import.

## 🔍 Vérification

### Voir les logs de la fonction

```bash
supabase functions logs sync-timeone-programs --follow
```

### Tester manuellement

```bash
curl -i --location --request POST \
  'https://VOTRE_PROJECT_REF.supabase.co/functions/v1/sync-timeone-programs' \
  --header 'Authorization: Bearer VOTRE_ANON_KEY' \
  --header 'Content-Type: application/json'
```

## 🐛 Dépannage

### Erreur "Function not found"

La fonction n'est pas déployée. Redéployez :
```bash
supabase functions deploy sync-timeone-programs
```

### Erreur "Unauthorized"

Vérifiez que votre `VITE_SUPABASE_ANON_KEY` est correcte dans `.env`

### Erreur "TimeOne API error"

Vérifiez que :
- L'API Key TimeOne est valide : `a4f8ffae42da880da36a26a1d1f4574d`
- Le Partner ID est correct : `64040`
- L'URL XML est accessible

### Aucun programme importé

Vérifiez les logs :
```bash
supabase functions logs sync-timeone-programs
```

## 📊 Prochaines Étapes

### Phase 2 : Synchronisation des Statistiques (À venir)

- Récupérer les ventes/leads depuis l'API SubID
- Créer automatiquement des RDV
- Mettre à jour les statistiques en temps réel

### Phase 3 : Enrichissement du Dashboard (À venir)

- Afficher les commissions réelles
- Graphiques de performance
- Taux de validation par programme

### Phase 4 : Automatisation (À venir)

- Cron job pour synchronisation quotidienne
- Webhooks TimeOne
- Notifications en temps réel

## 🔐 Sécurité

**Important** : Les clés API TimeOne sont actuellement dans le code de la Edge Function.

Pour une meilleure sécurité, utilisez Supabase Vault :

```bash
# Stocker les secrets
supabase secrets set TIMEONE_API_KEY=a4f8ffae42da880da36a26a1d1f4574d
supabase secrets set TIMEONE_PARTID=64040

# Puis dans le code :
const TIMEONE_API_KEY = Deno.env.get('TIMEONE_API_KEY')
const TIMEONE_PARTID = Deno.env.get('TIMEONE_PARTID')
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `supabase functions logs sync-timeone-programs`
2. Testez l'URL XML directement dans le navigateur
3. Vérifiez la console du navigateur (F12)
4. Consultez la documentation Supabase : https://supabase.com/docs/guides/functions

---

**Créé le** : 5 janvier 2025  
**Version** : 1.0.0  
**Status** : ✅ Prêt pour le déploiement
