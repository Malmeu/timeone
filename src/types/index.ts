export interface Projet {
  id: string
  nom: string
  objectif_mensuel: number
  objectif_quotidien: number
  solde_rdv: number
  rentabilite_estimee: number
  rdv_realises_jour?: number
  rdv_realises_mois?: number
  taux_avancement_jour?: number
  taux_avancement_mois?: number
  created_at: string
  updated_at: string
}

export interface RDV {
  id: string
  projet_id: string
  date_heure: string
  operateur: string
  statut: string
  created_at: string
}

export interface Planning {
  id: string
  creneau_debut: string
  creneau_fin: string
  projet_id: string | null
  taux_avancement: number
  recommandation: string | null
  date: string
  created_at: string
}

export interface Alerte {
  id: string
  type: 'vert' | 'rouge' | 'jaune'
  message: string
  date: string
  action_recommandee: string | null
  projet_id: string | null
  created_at: string
}

export interface ProjetScore {
  projet_id: string
  score: number
  raison: string
}
