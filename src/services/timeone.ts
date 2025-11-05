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

/**
 * Récupère les statistiques depuis l'API SubID TimeOne
 * @param startDate Date de début (format: YYYY-MM-DD)
 * @param endDate Date de fin (format: YYYY-MM-DD)
 * @param subId Identifiant SubID optionnel
 */
export async function getTimeOneStats(
  startDate: string,
  endDate: string,
  subId?: string
): Promise<any> {
  // TODO: Implémenter dans une prochaine phase
  console.log('getTimeOneStats not yet implemented', { startDate, endDate, subId })
  return null
}
