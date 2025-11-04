import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Planning } from '@/types'

export function usePlanning(date: Date = new Date()) {
  const [planning, setPlanning] = useState<(Planning & { projet_nom?: string })[]>([])
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
          projets (nom)
        `)
        .eq('date', dateStr)
        .order('creneau_debut')

      if (planningError) throw planningError

      const planningWithNames = (data || []).map((item: any) => ({
        ...item,
        projet_nom: item.projets?.nom || 'Non assigné',
      }))

      setPlanning(planningWithNames)
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
