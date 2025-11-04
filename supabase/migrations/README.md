# Migrations Supabase - TimeOne Dashboard

Ce dossier contient les migrations SQL pour la base de données Supabase.

## Migrations disponibles

### 1. `add_statut_to_projets.sql`
**Description :** Ajoute le champ `statut` à la table `projets` pour permettre la mise en pause des projets.

**Contenu :**
- Ajout de la colonne `statut` (VARCHAR(20))
- Valeurs possibles : 'actif', 'en_pause', 'termine'
- Valeur par défaut : 'actif'

### 2. `fix_solde_rdv_on_delete.sql`
**Description :** Corrige le calcul automatique du solde RDV lors de la suppression d'un RDV.

**Contenu :**
- Modification de la fonction `update_solde_rdv()` pour gérer INSERT et DELETE
- Ajout du trigger `update_solde_after_rdv_delete`
- Le solde RDV se met maintenant à jour automatiquement après suppression

## Comment exécuter les migrations

### Option 1 : Via l'interface Supabase (Recommandé)

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet TimeOne
3. Allez dans **SQL Editor** (dans le menu de gauche)
4. Cliquez sur **New Query**
5. Copiez-collez le contenu du fichier SQL
6. Cliquez sur **Run** (ou Ctrl/Cmd + Enter)

### Option 2 : Via Supabase CLI

```bash
# Se connecter à votre projet
supabase link --project-ref votre-project-ref

# Exécuter une migration spécifique
supabase db push

# Ou exécuter manuellement
psql -h db.votre-project-ref.supabase.co -U postgres -d postgres -f migrations/add_statut_to_projets.sql
```

## Ordre d'exécution

Exécutez les migrations dans cet ordre :

1. ✅ `add_statut_to_projets.sql` - Ajoute le statut aux projets
2. ✅ `fix_solde_rdv_on_delete.sql` - Corrige le calcul du solde RDV

## Vérification

Après avoir exécuté les migrations, vous pouvez vérifier qu'elles ont bien été appliquées :

```sql
-- Vérifier que la colonne statut existe
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'projets' AND column_name = 'statut';

-- Vérifier que les triggers existent
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'rdv';

-- Tester le calcul du solde RDV
SELECT id, nom, objectif_mensuel, solde_rdv 
FROM projets;
```

## Rollback (si nécessaire)

Si vous devez annuler une migration :

### Pour `add_statut_to_projets.sql`
```sql
ALTER TABLE projets DROP COLUMN IF EXISTS statut;
```

### Pour `fix_solde_rdv_on_delete.sql`
```sql
DROP TRIGGER IF EXISTS update_solde_after_rdv_delete ON rdv;
-- Le trigger INSERT reste actif
```

## Support

En cas de problème avec les migrations, contactez l'équipe de développement ou consultez la documentation Supabase : https://supabase.com/docs
