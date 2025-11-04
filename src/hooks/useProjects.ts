import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { startOfMonth, startOfDay, endOfDay } from 'date-fns'

export function useProjects() {
  const [projets, setProjets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      setLoading(true)
      
      // Récupérer tous les projets
      const { data: projetsData, error: projetsError } = await supabase
        .from('projets')
        .select('*')
        .order('nom')

      if (projetsError) throw projetsError

      // Pour chaque projet, calculer les RDV réalisés
      const projetsWithStats = await Promise.all(
        (projetsData || []).map(async (projet) => {
          // RDV du jour
          const { count: rdvJour } = await supabase
            .from('rdv')
            .select('*', { count: 'exact', head: true })
            .eq('projet_id', projet.id)
            .gte('date_heure', startOfDay(new Date()).toISOString())
            .lte('date_heure', endOfDay(new Date()).toISOString())

          // RDV du mois
          const { count: rdvMois } = await supabase
            .from('rdv')
            .select('*', { count: 'exact', head: true })
            .eq('projet_id', projet.id)
            .gte('date_heure', startOfMonth(new Date()).toISOString())

          const rdvRealisesJour = rdvJour || 0
          const rdvRealisesMois = rdvMois || 0

          return {
            ...projet,
            rdv_realises_jour: rdvRealisesJour,
            rdv_realises_mois: rdvRealisesMois,
            taux_avancement_jour: (rdvRealisesJour / projet.objectif_quotidien) * 100,
            taux_avancement_mois: (rdvRealisesMois / projet.objectif_mensuel) * 100,
          }
        })
      )

      setProjets(projetsWithStats)
      setError(null)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return { projets, loading, error, refetch: fetchProjects }
}
