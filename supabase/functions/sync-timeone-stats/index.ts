// Supabase Edge Function pour synchroniser les statistiques TimeOne (API SubID)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TimeOneAction {
  id: string
  programId: string
  programName: string
  actionDate: string
  validationDate?: string
  status: string // 0=refusé, 1=en attente, 2=approuvé
  type: string // 3=vente, 4=lead
  commission: string
  cartAmount?: string
  operateur?: string
}

interface SyncStatsRequest {
  startDate?: string // Format: YYYY-MM-DD
  endDate?: string // Format: YYYY-MM-DD
  status?: string // 0, 1, 2 ou 3
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Récupérer les paramètres de la requête
    const body: any = req.method === 'POST' 
      ? await req.json() 
      : {}

    const dryRun = body.dryRun || false // Mode test sans insertion

    // Dates par défaut : 30 derniers jours (1 mois)
    const endDate = body.endDate || new Date().toISOString().split('T')[0]
    const startDate = body.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const status = body.status || '2' // Par défaut : actions approuvées

    // Paramètres TimeOne API SubID
    const TIMEONE_PARTID = '64040'
    const TIMEONE_API_KEY = 'a4f8ffae42da880da36a26a1d1f4574d'
    const TIMEONE_SUBID_URL = `http://api.publicidees.com/subid.php5?k=${TIMEONE_API_KEY}&p=${TIMEONE_PARTID}&dd=${startDate}&df=${endDate}&s=${status}&td=a`

    console.log('Fetching TimeOne stats from:', TIMEONE_SUBID_URL)

    // Récupérer le XML depuis TimeOne API SubID
    const response = await fetch(TIMEONE_SUBID_URL)
    if (!response.ok) {
      throw new Error(`TimeOne API error: ${response.status}`)
    }

    const xmlText = await response.text()
    console.log('XML received, length:', xmlText.length)

    // Parser le XML pour extraire les actions
    const actions = parseTimeOneActionsXML(xmlText)
    console.log('Actions parsed:', actions.length)

    // Mode test : retourner le XML sans insertion
    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `Mode test: ${actions.length} actions trouvées`,
          period: { startDate, endDate },
          status: status === '3' ? 'Tous' : status === '2' ? 'Approuvés' : status === '1' ? 'En attente' : 'Refusés',
          xmlContent: xmlText,
          actions: actions.slice(0, 10).map(a => ({
            id: a.id,
            date: a.actionDate,
            commission: a.commission,
            programName: a.programName
          }))
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Connexion à Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Résultats de la synchronisation
    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      actions: [] as any[]
    }

    for (const action of actions) {
      try {
        // Trouver le projet correspondant par nom
        const { data: projet } = await supabase
          .from('projets')
          .select('id')
          .eq('nom', action.programName)
          .single()

        if (!projet) {
          console.log('Projet non trouvé pour:', action.programName)
          results.skipped++
          continue
        }

        // Vérifier si le RDV existe déjà (par action_id)
        const { data: existingRdv } = await supabase
          .from('rdv')
          .select('id')
          .eq('action_id', action.id)
          .single()

        if (existingRdv) {
          console.log('RDV déjà existant pour action:', action.id)
          results.skipped++
          continue
        }

        // Créer un nouveau RDV avec les données financières
        const { data: newRdv, error } = await supabase
          .from('rdv')
          .insert({
            projet_id: projet.id,
            date_heure: action.actionDate,
            operateur: action.operateur || 'TimeOne Auto',
            statut: getStatutFromTimeOneStatus(action.status),
            action_id: action.id,
            commission: parseFloat(action.commission) || 0,
            montant_panier: action.cartAmount ? parseFloat(action.cartAmount) : 0,
            type_action: action.type === '4' ? 'lead' : 'vente'
          })
          .select()
          .single()

        if (error) throw error

        results.imported++
        results.actions.push({
          actionId: action.id,
          programName: action.programName,
          rdvId: newRdv.id,
          date: action.actionDate
        })

      } catch (error) {
        console.error('Error processing action:', action.id, error)
        results.errors++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronisation réussie: ${results.imported} RDV importés, ${results.skipped} ignorés, ${results.errors} erreurs`,
        period: { startDate, endDate },
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in sync-timeone-stats:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

// Parser le XML des actions TimeOne
function parseTimeOneActionsXML(xmlText: string): TimeOneAction[] {
  const actions: TimeOneAction[] = []
  
  try {
    // Chercher tous les blocs <action>
    const actionRegex = /<action([^>]*)\/>/gi
    const matches = xmlText.matchAll(actionRegex)

    for (const match of matches) {
      const actionAttrs = match[1]
      
      // Extraire les attributs
      const getId = (attr: string) => {
        const m = actionAttrs.match(new RegExp(`${attr}="([^"]*)"`, 'i'))
        return m ? m[1] : ''
      }

      const id = getId('id')
      const actionDate = getId('ActionDate')
      const status = getId('ActionStatus')
      const type = getId('ActionType')
      
      if (id && actionDate) {
        actions.push({
          id,
          programId: getId('ProgramID') || '',
          programName: '', // Sera extrait du parent <program>
          actionDate,
          validationDate: getId('ValidationDate'),
          status,
          type,
          commission: getId('ActionCommission') || '0',
          cartAmount: getId('CartAmount'),
          operateur: getId('SubID') // Le SubID peut servir d'opérateur
        })
      }
    }

    // Extraire aussi les noms de programmes
    const programRegex = /<program id="([^"]*)">([\s\S]*?)<\/program>/gi
    const programMatches = xmlText.matchAll(programRegex)

    for (const programMatch of programMatches) {
      const programId = programMatch[1]
      const programContent = programMatch[2]
      
      // Extraire le nom du programme
      const nameMatch = programContent.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/i)
      const programName = nameMatch ? nameMatch[1].trim() : ''

      // Associer le nom aux actions de ce programme
      actions.forEach(action => {
        if (action.programId === programId) {
          action.programName = programName
        }
      })
    }

  } catch (error) {
    console.error('Error parsing actions XML:', error)
  }

  return actions
}

// Convertir le statut TimeOne en statut RDV
function getStatutFromTimeOneStatus(status: string): string {
  switch (status) {
    case '0': return 'annulé'
    case '1': return 'en_attente'
    case '2': return 'réalisé'
    case '3': return 'réalisé' // Approuvé et en facturation
    default: return 'en_attente'
  }
}
