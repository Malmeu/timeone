// @ts-nocheck
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
      
      // Récupérer tous les projets (actifs et en pause)
      const { data: projets, error } = await supabase
        .from('projets')
        .select('*')
        .order('nom')

      if (error) throw error

      // Pour chaque projet, calculer les RDV réalisés
      const projetsWithStats = await Promise.all(
        (projets || []).map(async (projet) => {
          // Ne calculer les stats que pour les projets actifs
          if (projet.statut === 'actif') {
            // RDV du jour
            const { count: rdvJour } = await supabase
              .from('rdv')
              .select('*', { count: 'exact', head: true })
              .eq('projet_id', projet.id as string)
              .gte('date_heure', startOfDay(new Date()).toISOString())
              .lte('date_heure', endOfDay(new Date()).toISOString())

            // RDV du mois
            const { count: rdvMois } = await supabase
              .from('rdv')
              .select('*', { count: 'exact', head: true })
              .eq('projet_id', projet.id as string)
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
          }
          
          // Pour les projets en pause, retourner 0 pour les stats
          return {
            ...projet,
            rdv_realises_jour: 0,
            rdv_realises_mois: 0,
            taux_avancement_jour: 0,
            taux_avancement_mois: 0,
          }
        })
      )

      // Calculer les objectifs totaux des projets actifs
      const projetsActifs = projetsWithStats.filter(p => p.statut === 'actif')
      const objectifQuotidienTotal = projetsActifs.reduce((sum, p) => sum + p.objectif_quotidien, 0)
      const objectifMensuelTotal = projetsActifs.reduce((sum, p) => sum + p.objectif_mensuel, 0)

      const projetsWithTotals = projetsWithStats.map(projet => ({
        ...projet,
        objectif_quotidien_total: objectifQuotidienTotal,
        objectif_mensuel_total: objectifMensuelTotal,
      }))

      setProjets(projetsWithTotals)
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
