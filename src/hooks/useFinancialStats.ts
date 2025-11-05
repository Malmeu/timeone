// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface FinancialStats {
  totalCommission: number
  totalVentes: number
  montantPanier: number
  tauxValidation: number
}

export function useFinancialStats() {
  const [stats, setStats] = useState<FinancialStats>({
    totalCommission: 0,
    totalVentes: 0,
    montantPanier: 0,
    tauxValidation: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      setLoading(true)

      // Récupérer tous les RDV avec leurs données financières
      const { data: rdvs, error: rdvError } = await supabase
        .from('rdv')
        .select('commission, montant_panier, statut, type_action')

      if (rdvError) throw rdvError

      // Calculer les statistiques
      const totalCommission = rdvs?.reduce((sum, rdv) => {
        return sum + (parseFloat(rdv.commission as string) || 0)
      }, 0) || 0

      const totalVentes = rdvs?.filter(rdv => 
        rdv.statut === 'réalisé' && rdv.type_action === 'vente'
      ).length || 0

      const montantPanier = rdvs?.reduce((sum, rdv) => {
        return sum + (parseFloat(rdv.montant_panier as string) || 0)
      }, 0) || 0

      // Calculer le taux de validation
      const totalActions = rdvs?.length || 0
      const actionsApprouvees = rdvs?.filter(rdv => rdv.statut === 'réalisé').length || 0
      const tauxValidation = totalActions > 0 ? (actionsApprouvees / totalActions) * 100 : 0

      setStats({
        totalCommission,
        totalVentes,
        montantPanier,
        tauxValidation
      })

    } catch (err) {
      console.error('Error fetching financial stats:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}
