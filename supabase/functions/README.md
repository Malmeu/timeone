# Supabase Edge Functions - TimeOne Dashboard

Ce dossier contient les Edge Functions Supabase pour l'intégration avec l'API TimeOne.

## Functions disponibles

### `sync-timeone-programs`

Synchronise automatiquement les programmes TimeOne avec la base de données locale.

**Fonctionnalités :**
- Récupère le flux XML des programmes depuis TimeOne
- Parse les données XML
- Crée ou met à jour les projets dans la base de données
- Évite les doublons en vérifiant par nom

**Paramètres TimeOne :**
- Partner ID: `64040`
- API Key: `a4f8ffae42da880da36a26a1d1f4574d`
- URL XML: `https://publisher.performance.timeone.io/xmlProgAff.php`

## Déploiement

### Prérequis

1. Installer Supabase CLI :
```bash
npm install -g supabase
```

2. Se connecter à votre projet Supabase :
```bash
supabase login
supabase link --project-ref votre-project-ref
```

### Déployer la fonction

```bash
# Déployer toutes les functions
supabase functions deploy

# Ou déployer une fonction spécifique
supabase functions deploy sync-timeone-programs
```

### Tester localement

```bash
# Démarrer Supabase localement
supabase start

# Servir la fonction localement
supabase functions serve sync-timeone-programs

# Tester avec curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/sync-timeone-programs' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json'
```

## Variables d'environnement

Les Edge Functions ont automatiquement accès à :
- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role (pour les opérations admin)

## Utilisation depuis le frontend

```typescript
import { syncTimeOnePrograms } from '@/services/timeone'

// Appeler la synchronisation
const result = await syncTimeOnePrograms()

if (result.success) {
  console.log('Programmes synchronisés:', result.results)
} else {
  console.error('Erreur:', result.error)
}
```

## Structure de la réponse

```json
{
  "success": true,
  "message": "Synchronisation réussie: 5 importés, 3 mis à jour, 0 erreurs",
  "results": {
    "imported": 5,
    "updated": 3,
    "errors": 0,
    "programs": [
      {
        "id": "123",
        "name": "Programme Example",
        "action": "imported"
      }
    ]
  }
}
```

## Logs et Debugging

Pour voir les logs de la fonction :

```bash
# Via Supabase CLI
supabase functions logs sync-timeone-programs

# Ou via le dashboard Supabase
# Allez dans Functions > sync-timeone-programs > Logs
```

## Sécurité

- La fonction utilise CORS pour autoriser les requêtes depuis votre frontend
- L'authentification se fait via le token Supabase
- Les clés API TimeOne sont stockées dans le code de la fonction (à améliorer avec des secrets)

## Améliorations futures

1. **Secrets Management** : Stocker les clés API dans Supabase Vault
2. **Cron Job** : Automatiser la synchronisation quotidienne
3. **Webhooks** : Écouter les événements TimeOne en temps réel
4. **Cache** : Mettre en cache les résultats XML pour éviter les appels répétés
5. **Validation** : Ajouter une validation plus stricte des données XML
