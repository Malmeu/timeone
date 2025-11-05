import { useMemo, useState } from 'react'
import { RefreshCw, TrendingUp, Target, AlertCircle, Plus, Download, Filter } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useAlertes } from '@/hooks/useAlertes'
import { useNotificationMonitor } from '@/hooks/useNotificationMonitor'
import { getProjectRecommendation } from '@/lib/scoring'
import ProjectCard from '@/components/ProjectCard'
import AlertCard from '@/components/AlertCard'
import RecommendationCard from '@/components/RecommendationCard'
import AddRdvModal from '@/components/AddRdvModal'
import AddProjetModal from '@/components/AddProjetModal'
import { syncTimeOneStats } from '@/services/timeone'

export default function Dashboard() {
  const { projets, loading: loadingProjets, refetch: refetchProjets } = useProjects()
  const { alertes, loading: loadingAlertes } = useAlertes()
  const [showAddRdvModal, setShowAddRdvModal] = useState(false)
  const [showAddProjetModal, setShowAddProjetModal] = useState(false)
  const [syncingStats, setSyncingStats] = useState(false)
  const [selectedProjets, setSelectedProjets] = useState<string[]>([])
  const [showFilter, setShowFilter] = useState(false)
  
  // Monitoring des notifications
  useNotificationMonitor(projets)

  const handleSyncStats = async () => {
    setSyncingStats(true)
    try {
      // Synchroniser les 30 derniers jours par défaut
      const result = await syncTimeOneStats()
      if (result.success) {
        const msg = result.message || 'Synchronisation réussie !'
        const details = result.results 
          ? `\n\n📊 Détails:\n• ${result.results.imported} RDV importés\n• ${result.results.skipped} ignorés (déjà existants)\n• Période: ${result.period?.startDate} → ${result.period?.endDate}`
          : ''
        alert(msg + details)
        refetchProjets() // Recharger les projets
      } else {
        alert('Erreur lors de la synchronisation : ' + (result.error || 'Erreur inconnue'))
      }
    } catch (error) {
      console.error('Sync stats error:', error)
      alert('Erreur lors de la synchronisation des statistiques')
    } finally {
      setSyncingStats(false)
    }
  }

  // Projets filtrés selon la sélection
  const projetsFiltres = useMemo(() => {
    if (selectedProjets.length === 0) return projets
    return projets.filter(p => selectedProjets.includes(p.id as string))
  }, [projets, selectedProjets])

  const recommendation = useMemo(() => {
    if (projetsFiltres.length === 0) return null
    const rec = getProjectRecommendation(projetsFiltres)
    if (!rec) return null
    
    const projet = projetsFiltres.find(p => p.id === rec.projet_id)
    if (!projet) return null
    
    return {
      ...rec,
      nom: projet.nom,
    }
  }, [projetsFiltres])

  const stats = useMemo(() => {
    // Filtrer uniquement les projets actifs pour les calculs
    const projetsActifs = projetsFiltres.filter(p => p.statut === 'actif')
    
    const totalRdvJour = projetsActifs.reduce((sum, p) => sum + (p.rdv_realises_jour || 0), 0)
    const totalObjectifJour = projetsActifs.reduce((sum, p) => sum + p.objectif_quotidien, 0)
    const totalRdvMois = projetsActifs.reduce((sum, p) => sum + (p.rdv_realises_mois || 0), 0)
    const totalObjectifMois = projetsActifs.reduce((sum, p) => sum + p.objectif_mensuel, 0)
    
    return {
      rdvJour: totalRdvJour,
      objectifJour: totalObjectifJour,
      tauxJour: totalObjectifJour > 0 ? (totalRdvJour / totalObjectifJour) * 100 : 0,
      rdvMois: totalRdvMois,
      objectifMois: totalObjectifMois,
      tauxMois: totalObjectifMois > 0 ? (totalRdvMois / totalObjectifMois) * 100 : 0,
    }
  }, [projets])

  if (loadingProjets) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de vos projets</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              selectedProjets.length > 0
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrer {selectedProjets.length > 0 && `(${selectedProjets.length})`}
          </button>
          <button
            onClick={handleSyncStats}
            disabled={syncingStats}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncingStats ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sync Stats...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Sync Stats
              </>
            )}
          </button>
          <button
            onClick={() => setShowAddProjetModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
          </button>
          <button
            onClick={() => setShowAddRdvModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un RDV
          </button>
          <button
            onClick={refetchProjets}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Panneau de filtrage */}
      {showFilter && (
        <div className="glass-effect rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtrer par projets</h3>
            <button
              onClick={() => setSelectedProjets([])}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Réinitialiser
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {projets.map((projet) => {
              const isSelected = selectedProjets.includes(projet.id as string)
              return (
                <button
                  key={projet.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedProjets(selectedProjets.filter(id => id !== projet.id))
                    } else {
                      setSelectedProjets([...selectedProjets, projet.id as string])
                    }
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${projet.statut === 'pause' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900">{projet.nom}</span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {projet.statut === 'pause' && (
                    <span className="text-xs text-gray-500 mt-1 block">En pause</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-primary-100 rounded-lg p-2">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <span className={`text-2xl font-bold ${stats.tauxJour >= 100 ? 'text-green-600' : 'text-gray-900'}`}>
              {stats.tauxJour.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Objectif Journalier</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats.rdvJour} / {stats.objectifJour}
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 rounded-lg p-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`text-2xl font-bold ${stats.tauxMois >= 70 ? 'text-green-600' : 'text-gray-900'}`}>
              {stats.tauxMois.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Objectif Mensuel</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats.rdvMois} / {stats.objectifMois}
          </p>
        </div>

        <div className="glass-effect rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 rounded-lg p-2">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{alertes.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Alertes Actives</h3>
          <p className="text-sm text-gray-600 mt-1">Dernières 24h</p>
        </div>
      </div>

      {/* Recommandation */}
      {recommendation && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommandation IA</h2>
          <RecommendationCard recommendation={recommendation} />
        </div>
      )}

      {/* Projets */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vos Projets {selectedProjets.length > 0 && `(${projetsFiltres.length} filtré${projetsFiltres.length > 1 ? 's' : ''})`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetsFiltres.map((projet) => (
            <ProjectCard key={projet.id} projet={projet} onUpdate={refetchProjets} />
          ))}
        </div>
        {projetsFiltres.length === 0 && (
          <div className="text-center py-12 glass-effect rounded-xl">
            <p className="text-gray-500">
              {selectedProjets.length > 0 
                ? 'Aucun projet ne correspond aux filtres sélectionnés'
                : 'Aucun projet trouvé'
              }
            </p>
          </div>
        )}
      </div>

      {/* Alertes */}
      {!loadingAlertes && alertes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alertes Récentes</h2>
          <div className="space-y-3">
            {alertes.map((alerte) => (
              <AlertCard key={alerte.id} alerte={alerte} />
            ))}
          </div>
        </div>
      )}

      {/* Modal d'ajout de projet */}
      {showAddProjetModal && (
        <AddProjetModal
          onClose={() => setShowAddProjetModal(false)}
          onSuccess={() => {
            refetchProjets()
            setShowAddProjetModal(false)
          }}
        />
      )}

      {/* Modal d'ajout de RDV */}
      {showAddRdvModal && (
        <AddRdvModal
          projets={projets}
          onClose={() => setShowAddRdvModal(false)}
          onSuccess={() => {
            refetchProjets()
            setShowAddRdvModal(false)
          }}
        />
      )}
    </div>
  )
}
