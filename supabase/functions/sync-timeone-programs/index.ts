// Supabase Edge Function pour synchroniser les programmes TimeOne
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TimeOneProgram {
  id: string
  name: string
  description?: string
  commission?: string
  status?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Récupérer les paramètres de la requête
    const body = req.method === 'POST' ? await req.json() : {}
    const dryRun = body.dryRun || false // Mode test sans insertion

    // Paramètres TimeOne API
    const TIMEONE_PARTID = '64040'
    const TIMEONE_API_KEY = 'a4f8ffae42da880da36a26a1d1f4574d'
    const TIMEONE_XML_URL = `https://publisher.performance.timeone.io/xmlProgAff.php?partid=${TIMEONE_PARTID}&key=${TIMEONE_API_KEY}`

    console.log('Fetching TimeOne programs from:', TIMEONE_XML_URL)

    // Récupérer le XML depuis TimeOne
    const response = await fetch(TIMEONE_XML_URL)
    if (!response.ok) {
      throw new Error(`TimeOne API error: ${response.status}`)
    }

    const xmlText = await response.text()
    console.log('XML received, length:', xmlText.length)

    // Parser le XML (simple parsing pour extraire les programmes)
    const programs = parseTimeOneXML(xmlText)
    console.log('Programs parsed:', programs.length)

    // Mode test : retourner le XML sans insertion
    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `Mode test: ${programs.length} programmes trouvés`,
          xmlContent: xmlText,
          programs: programs.map(p => ({ id: p.id, name: p.name }))
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

    // Insérer ou mettre à jour les programmes dans la base
    const results = {
      imported: 0,
      updated: 0,
      errors: 0,
      programs: [] as any[]
    }

    for (const program of programs) {
      try {
        // Vérifier si le programme existe déjà (par nom)
        const { data: existing } = await supabase
          .from('projets')
          .select('id, nom')
          .eq('nom', program.name)
          .single()

        if (existing) {
          // Mettre à jour le programme existant
          const { error } = await supabase
            .from('projets')
            .update({
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)

          if (error) throw error
          results.updated++
          results.programs.push({ ...program, action: 'updated', id: existing.id })
        } else {
          // Créer un nouveau projet avec des valeurs par défaut
          const { data, error } = await supabase
            .from('projets')
            .insert({
              nom: program.name,
              objectif_mensuel: 30, // Valeur par défaut
              objectif_quotidien: 1, // Valeur par défaut
              solde_rdv: 30,
              rentabilite_estimee: 0,
              statut: 'actif'
            })
            .select()
            .single()

          if (error) throw error
          results.imported++
          results.programs.push({ ...program, action: 'imported', id: data.id })
        }
      } catch (error) {
        console.error('Error processing program:', program.name, error)
        results.errors++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronisation réussie: ${results.imported} importés, ${results.updated} mis à jour, ${results.errors} erreurs`,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in sync-timeone-programs:', error)
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

// Fonction pour parser le XML TimeOne
function parseTimeOneXML(xmlText: string): TimeOneProgram[] {
  const programs: TimeOneProgram[] = []
  
  try {
    // Parser simple avec regex (pour éviter les dépendances lourdes)
    // Chercher tous les blocs <program>...</program>
    const programRegex = /<program[^>]*>([\s\S]*?)<\/program>/gi
    const matches = xmlText.matchAll(programRegex)

    for (const match of matches) {
      const programXml = match[1]
      
      // Extraire l'ID
      const idMatch = match[0].match(/id="([^"]+)"/)
      const id = idMatch ? idMatch[1] : ''

      // Extraire le nom
      const nameMatch = programXml.match(/<name[^>]*><!\[CDATA\[(.*?)\]\]><\/name>/i)
      const name = nameMatch ? nameMatch[1].trim() : ''

      // Extraire la description
      const descMatch = programXml.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>/i)
      const description = descMatch ? descMatch[1].trim() : ''

      // Extraire le statut
      const statusMatch = programXml.match(/<status[^>]*>([^<]+)<\/status>/i)
      const status = statusMatch ? statusMatch[1].trim() : ''

      if (name) {
        programs.push({
          id,
          name,
          description,
          status
        })
      }
    }
  } catch (error) {
    console.error('Error parsing XML:', error)
  }

  return programs
}
