export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projets: {
        Row: {
          id: string
          nom: string
          objectif_mensuel: number
          objectif_quotidien: number
          solde_rdv: number
          rentabilite_estimee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          objectif_mensuel: number
          objectif_quotidien: number
          solde_rdv?: number
          rentabilite_estimee?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          objectif_mensuel?: number
          objectif_quotidien?: number
          solde_rdv?: number
          rentabilite_estimee?: number
          updated_at?: string
        }
      }
      rdv: {
        Row: {
          id: string
          projet_id: string
          date_heure: string
          operateur: string
          statut: string
          created_at: string
        }
        Insert: {
          id?: string
          projet_id: string
          date_heure: string
          operateur: string
          statut?: string
          created_at?: string
        }
        Update: {
          id?: string
          projet_id?: string
          date_heure?: string
          operateur?: string
          statut?: string
        }
      }
      planning: {
        Row: {
          id: string
          creneau_debut: string
          creneau_fin: string
          projet_id: string | null
          taux_avancement: number
          recommandation: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          creneau_debut: string
          creneau_fin: string
          projet_id?: string | null
          taux_avancement?: number
          recommandation?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          creneau_debut?: string
          creneau_fin?: string
          projet_id?: string | null
          taux_avancement?: number
          recommandation?: string | null
          date?: string
        }
      }
      alertes: {
        Row: {
          id: string
          type: 'vert' | 'rouge' | 'jaune'
          message: string
          date: string
          action_recommandee: string | null
          projet_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'vert' | 'rouge' | 'jaune'
          message: string
          date: string
          action_recommandee?: string | null
          projet_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'vert' | 'rouge' | 'jaune'
          message?: string
          date?: string
          action_recommandee?: string | null
          projet_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
