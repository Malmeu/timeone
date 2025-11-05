import { useState } from 'react'
import { Play, Download, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface TestResult {
  success: boolean
  title: string
  data?: any
  error?: string
  duration?: number
}

export default function TestApi() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [period, setPeriod] = useState(30) // Jours
  const [status, setStatus] = useState('2') // 0=refusé, 1=attente, 2=approuvé, 3=tous

  const SUPABASE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

  // Test 1: Récupérer les programmes via Edge Function
  const testPrograms = async () => {
    const startTime = Date.now()
    try {
      const response = await fetch(`${SUPABASE_FUNCTION_URL}/sync-timeone-programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ dryRun: true }) // Mode test sans insertion
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur inconnue')
      }

      const xml = result.xmlContent || ''

      // Parser les programmes
      const programRegex = /<program[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/program>/gi
      const matches = [...xml.matchAll(programRegex)]

      const programs = matches.map(match => {
        const programId = match[1]
        const programContent = match[2]
        const nameMatch = programContent.match(/<program_name><!\[CDATA\[(.*?)\]\]><\/program_name>/i)
        const name = nameMatch ? nameMatch[1].trim() : 'Sans nom'
        return { id: programId, name }
      })

      return {
        success: true,
        title: '📋 Programmes TimeOne',
        data: {
          total: programs.length,
          programs,
          xmlLength: xml.length
        },
        duration: Date.now() - startTime
      }
    } catch (error: any) {
      return {
        success: false,
        title: '📋 Programmes TimeOne',
        error: error.message,
        duration: Date.now() - startTime
      }
    }
  }

  // Test 2: Récupérer les actions/stats via Edge Function
  const testActions = async () => {
    const startTime = Date.now()
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const response = await fetch(`${SUPABASE_FUNCTION_URL}/sync-timeone-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          startDate,
          endDate,
          status,
          dryRun: true // Mode test sans insertion
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur inconnue')
      }

      const xml = result.xmlContent || ''

      // Parser les actions
      const actionRegex = /<action([^>]*)\/>/gi
      const matches = [...xml.matchAll(actionRegex)]

      const actions = matches.slice(0, 10).map(match => {
        const attrs = match[1]
        const getId = (attr: string) => {
          const m = attrs.match(new RegExp(`${attr}="([^"]*)"`, 'i'))
          return m ? m[1] : 'N/A'
        }
        return {
          id: getId('id'),
          date: getId('ActionDate'),
          commission: getId('ActionCommission'),
          panier: getId('CartAmount'),
          programId: getId('ProgramID'),
          status: getId('ActionStatus')
        }
      })

      return {
        success: true,
        title: '📊 Actions TimeOne',
        data: {
          total: matches.length,
          period: `${startDate} → ${endDate}`,
          status: status === '3' ? 'Tous' : status === '2' ? 'Approuvés' : status === '1' ? 'En attente' : 'Refusés',
          actions,
          xmlLength: xml.length
        },
        duration: Date.now() - startTime
      }
    } catch (error: any) {
      return {
        success: false,
        title: '📊 Actions TimeOne',
        error: error.message,
        duration: Date.now() - startTime
      }
    }
  }

  // Test 3: Vérifier les projets en base
  const testProjects = async () => {
    const startTime = Date.now()
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )

      const { data: projets, error } = await supabase
        .from('projets')
        .select('id, nom')
        .order('nom')

      if (error) throw error

      return {
        success: true,
        title: '🗄️ Projets en Base',
        data: {
          total: projets?.length || 0,
          projets
        },
        duration: Date.now() - startTime
      }
    } catch (error: any) {
      return {
        success: false,
        title: '🗄️ Projets en Base',
        error: error.message,
        duration: Date.now() - startTime
      }
    }
  }

  // Test 4: Vérifier les RDV avec données financières
  const testRdvFinancial = async () => {
    const startTime = Date.now()
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )

      const { data: rdvs, error } = await supabase
        .from('rdv')
        .select('id, commission, montant_panier, action_id, type_action, statut')
        .not('commission', 'is', null)
        .order('commission', { ascending: false })
        .limit(10)

      if (error) throw error

      const totalCommission = rdvs?.reduce((sum, rdv) => sum + (parseFloat(rdv.commission as string) || 0), 0) || 0

      return {
        success: true,
        title: '💰 RDV avec Données Financières',
        data: {
          total: rdvs?.length || 0,
          totalCommission: totalCommission.toFixed(2),
          rdvs
        },
        duration: Date.now() - startTime
      }
    } catch (error: any) {
      return {
        success: false,
        title: '💰 RDV avec Données Financières',
        error: error.message,
        duration: Date.now() - startTime
      }
    }
  }

  // Exécuter tous les tests
  const runAllTests = async () => {
    setLoading(true)
    setResults([])

    const tests = [
      testPrograms(),
      testActions(),
      testProjects(),
      testRdvFinancial()
    ]

    const testResults = await Promise.all(tests)
    setResults(testResults)
    setLoading(false)
  }

  // Télécharger les résultats en JSON
  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `timeone-test-results-${new Date().toISOString()}.json`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Test API TimeOne</h1>
          <p className="text-gray-600">
            Page de test pour vérifier les connexions API et les données sans perturber le Dashboard
          </p>
        </div>

        {/* Configuration */}
        <div className="glass-effect rounded-xl p-6 mb-6 card-shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Configuration des Tests</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période (jours)
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={7}>7 derniers jours</option>
                <option value={30}>30 derniers jours</option>
                <option value={60}>60 derniers jours</option>
                <option value={90}>90 derniers jours</option>
                <option value={180}>180 derniers jours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut des actions
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="0">Refusées</option>
                <option value="1">En attente</option>
                <option value="2">Approuvées</option>
                <option value="3">Tous les statuts</option>
              </select>
            </div>
          </div>

          <button
            onClick={runAllTests}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Tests en cours...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Lancer tous les tests
              </>
            )}
          </button>
        </div>

        {/* Résultats */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">📋 Résultats des Tests</h2>
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Télécharger JSON
              </button>
            </div>

            {results.map((result, index) => (
              <div
                key={index}
                className={`glass-effect rounded-xl p-6 card-shadow border-l-4 ${
                  result.success ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-500">
                        Durée: {result.duration}ms
                      </p>
                    </div>
                  </div>
                </div>

                {result.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Erreur</p>
                        <p className="text-sm text-red-700">{result.error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {result.data && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        {results.length === 0 && !loading && (
          <div className="glass-effect rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Configurez les paramètres et lancez les tests pour voir les résultats
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
