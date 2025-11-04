import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Alerte } from '@/types'
import { startOfDay } from 'date-fns'

export function useAlertes() {
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlertes()
  }, [])

  async function fetchAlertes() {
    try {
      setLoading(true)
      
      const { data, error: alertesError } = await supabase
        .from('alertes')
        .select('*')
        .gte('date', startOfDay(new Date()).toISOString())
        .order('created_at', { ascending: false })
        .limit(10)

      if (alertesError) throw alertesError

      setAlertes(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching alertes:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return { alertes, loading, error, refetch: fetchAlertes }
}
