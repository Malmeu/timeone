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
          objectif_quotidien: number
          objectif_mensuel: number
          solde_rdv: number
          rentabilite_estimee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          objectif_quotidien: number
          objectif_mensuel: number
          solde_rdv?: number
          rentabilite_estimee?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          objectif_quotidien?: number
          objectif_mensuel?: number
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
          updated_at: string
        }
        Insert: {
          id?: string
          projet_id: string
          date_heure: string
          operateur: string
          statut?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          projet_id?: string
          date_heure?: string
          operateur?: string
          statut?: string
          updated_at?: string
        }
      }
      planning: {
        Row: {
          id: string
          projet_id: string
          date: string
          creneau: string
          taux_avancement: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          projet_id: string
          date: string
          creneau: string
          taux_avancement?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          projet_id?: string
          date?: string
          creneau?: string
          taux_avancement?: number
          updated_at?: string
        }
      }
      alertes: {
        Row: {
          id: string
          projet_id: string
          type: string
          message: string
          created_at: string
          lu: boolean
        }
        Insert: {
          id?: string
          projet_id: string
          type: string
          message: string
          created_at?: string
          lu?: boolean
        }
        Update: {
          id?: string
          projet_id?: string
          type?: string
          message?: string
          lu?: boolean
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

// Types pour les tables
export type Projet = Database['public']['Tables']['projets']['Row']
export type Rdv = Database['public']['Tables']['rdv']['Row']
export type Planning = Database['public']['Tables']['planning']['Row']
export type Alerte = Database['public']['Tables']['alertes']['Row']

// Types pour les insertions
export type ProjetInsert = Database['public']['Tables']['projets']['Insert']
export type RdvInsert = Database['public']['Tables']['rdv']['Insert']
export type PlanningInsert = Database['public']['Tables']['planning']['Insert']
export type AlerteInsert = Database['public']['Tables']['alertes']['Insert']

// Types pour les updates
export type ProjetUpdate = Database['public']['Tables']['projets']['Update']
export type RdvUpdate = Database['public']['Tables']['rdv']['Update']
export type PlanningUpdate = Database['public']['Tables']['planning']['Update']
export type AlerteUpdate = Database['public']['Tables']['alertes']['Update']
