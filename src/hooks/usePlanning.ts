import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Planning } from '@/types'

export function usePlanning(date: Date = new Date()) {
  const [planning, setPlanning] = useState<(Planning & { projet_nom?: string, taux_avancement?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchPlanning() {
    try {
      setLoading(true)
      
      const dateStr = date.toISOString().split('T')[0]
      
      const { data, error: planningError } = await supabase
        .from('planning')
        .select(`
          *,
          projets (nom, objectif_quotidien, statut)
        `)
        .eq('date', dateStr)
        .order('creneau_debut')

      if (planningError) throw planningError

      // Filtrer les projets actifs et calculer le taux d'avancement
      const planningWithProgress = await Promise.all(
        (data || [])
          .filter(item => item.projets?.statut === 'actif') // Ne garder que les projets actifs
          .map(async (item: any) => {
            let taux_avancement = 0
            
            if (item.projet_id && item.projets) {
              // Compter les RDV réalisés pour toute la journée
              const startOfDay = `${dateStr}T00:00:00`
              const endOfDay = `${dateStr}T23:59:59`
              
              const { count } = await supabase
                .from('rdv')
                .select('*', { count: 'exact', head: true })
                .eq('projet_id', item.projet_id)
                .gte('date_heure', startOfDay)
                .lte('date_heure', endOfDay)
              
              // Calculer le taux basé sur l'objectif quotidien
              taux_avancement = ((count || 0) / item.projets.objectif_quotidien) * 100
            }
            
            return {
              ...item,
              projet_nom: item.projets?.nom || 'Non assigné',
              taux_avancement: taux_avancement,
            }
          })
      )

      setPlanning(planningWithProgress)
      setError(null)
    } catch (err) {
      console.error('Error fetching planning:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanning()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date.toISOString()])

  return { planning, loading, error, refetch: fetchPlanning }
}
