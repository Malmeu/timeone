// Service pour interagir avec l'API TimeOne via Supabase Edge Functions

const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1'

export interface SyncResult {
  success: boolean
  message?: string
  results?: {
    imported: number
    updated: number
    errors: number
    programs: Array<{
      id: string
      name: string
      action: 'imported' | 'updated'
    }>
  }
  error?: string
}

/**
 * Synchronise les programmes TimeOne avec la base de données locale
 */
export async function syncTimeOnePrograms(): Promise<SyncResult> {
  try {
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/sync-timeone-programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error syncing TimeOne programs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

export interface SyncStatsResult {
  success: boolean
  message?: string
  period?: {
    startDate: string
    endDate: string
  }
  results?: {
    imported: number
    skipped: number
    errors: number
    actions: Array<{
      actionId: string
      programName: string
      rdvId: string
      date: string
    }>
  }
  error?: string
}

/**
 * Synchronise les statistiques TimeOne (ventes/leads) et crée automatiquement des RDV
 * @param startDate Date de début (format: YYYY-MM-DD) - Par défaut: 7 jours avant
 * @param endDate Date de fin (format: YYYY-MM-DD) - Par défaut: aujourd'hui
 * @param status Statut des actions (0=refusé, 1=en attente, 2=approuvé) - Par défaut: 2
 */
export async function syncTimeOneStats(
  startDate?: string,
  endDate?: string,
  status?: string
): Promise<SyncStatsResult> {
  try {
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/sync-timeone-stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ startDate, endDate, status })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error syncing TimeOne stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}
