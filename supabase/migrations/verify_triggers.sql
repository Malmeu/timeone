-- Vérification des triggers et de la fonction

-- 1. Vérifier que la fonction existe
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_name = 'update_solde_rdv';

-- 2. Vérifier que les triggers existent
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'rdv'
ORDER BY trigger_name;

-- 3. Tester manuellement le calcul du solde pour un projet
-- Remplacez 'NOM_DU_PROJET' par le nom d'un de vos projets
SELECT 
    p.id,
    p.nom,
    p.objectif_mensuel,
    p.solde_rdv as solde_actuel,
    (p.objectif_mensuel - COUNT(r.id)) as solde_calcule,
    COUNT(r.id) as rdv_ce_mois
FROM projets p
LEFT JOIN rdv r ON r.projet_id = p.id 
    AND EXTRACT(MONTH FROM r.date_heure) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM r.date_heure) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY p.id, p.nom, p.objectif_mensuel, p.solde_rdv
ORDER BY p.nom;

-- 4. Forcer la mise à jour du solde pour tous les projets
-- DÉCOMMENTEZ CETTE LIGNE SI VOUS VOULEZ FORCER LA MISE À JOUR :
-- SELECT update_solde_rdv_for_all_projects();
