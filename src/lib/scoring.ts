import { Projet, ProjetScore } from '@/types'

/**
 * Algorithme de scoring pour déterminer le projet prioritaire
 * 
 * Critères:
 * - Retard accumulé (poids: 40%)
 * - Rentabilité (poids: 30%)
 * - Volume restant (poids: 30%)
 */
export function calculateProjectScore(projet: Projet): number {
  const tauxJour = projet.taux_avancement_jour || 0
  const tauxMois = projet.taux_avancement_mois || 0
  
  // Score de retard (0-100) - Plus le retard est important, plus le score est élevé
  let retardScore = 0
  if (tauxJour < 100) {
    retardScore = Math.max(0, 100 - tauxJour)
  }
  if (tauxMois < 70) {
    retardScore += 30 // Bonus si retard mensuel critique
  }
  
  // Score de rentabilité (0-100) - Normalisé
  const rentabiliteScore = Math.min(100, (projet.rentabilite_estimee / 1000) * 100)
  
  // Score de volume restant (0-100)
  const volumeScore = Math.min(100, (projet.solde_rdv / projet.objectif_mensuel) * 100)
  
  // Calcul du score final pondéré
  const scoreTotal = (
    retardScore * 0.4 +
    rentabiliteScore * 0.3 +
    volumeScore * 0.3
  )
  
  return scoreTotal
}

export function getProjectRecommendation(projets: Projet[]): ProjetScore | null {
  if (projets.length === 0) return null
  
  const scores = projets.map(projet => ({
    projet_id: projet.id,
    score: calculateProjectScore(projet),
    raison: generateReason(projet),
  }))
  
  // Trier par score décroissant
  scores.sort((a, b) => b.score - a.score)
  
  return scores[0]
}

function generateReason(projet: Projet): string {
  const tauxJour = projet.taux_avancement_jour || 0
  const tauxMois = projet.taux_avancement_mois || 0
  
  const reasons: string[] = []
  
  if (tauxJour < 70) {
    reasons.push(`Retard important sur l'objectif journalier (${tauxJour.toFixed(0)}%)`)
  } else if (tauxJour < 100) {
    reasons.push(`Objectif journalier non atteint (${tauxJour.toFixed(0)}%)`)
  }
  
  if (tauxMois < 70) {
    reasons.push(`Retard critique sur l'objectif mensuel (${tauxMois.toFixed(0)}%)`)
  }
  
  if (projet.rentabilite_estimee > 500) {
    reasons.push(`Rentabilité élevée (${projet.rentabilite_estimee}€)`)
  }
  
  if (projet.solde_rdv > projet.objectif_mensuel * 0.5) {
    reasons.push(`Volume important restant (${projet.solde_rdv} RDV)`)
  }
  
  if (reasons.length === 0) {
    return 'Projet équilibré avec bon potentiel'
  }
  
  return reasons.join('. ')
}
