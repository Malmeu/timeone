import { useMemo, useState } from 'react'
import { RefreshCw, TrendingUp, Target, AlertCircle, Plus, Download } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useAlertes } from '@/hooks/useAlertes'
import { useFinancialStats } from '@/hooks/useFinancialStats'
import { useNotificationMonitor } from '@/hooks/useNotificationMonitor'
import { getProjectRecommendation } from '@/lib/scoring'
import ProjectCard from '@/components/ProjectCard'
import AlertCard from '@/components/AlertCard'
import RecommendationCard from '@/components/RecommendationCard'
import FinancialStatsCard from '@/components/FinancialStatsCard'
import AddRdvModal from '@/components/AddRdvModal'
import AddProjetModal from '@/components/AddProjetModal'
import { syncTimeOneStats } from '@/services/timeone'

export default function Dashboard() {
  const { projets, loading: loadingProjets, refetch: refetchProjets } = useProjects()
  const { alertes, loading: loadingAlertes } = useAlertes()
  const { stats: financialStats, refetch: refetchStats } = useFinancialStats()
  const [showAddRdvModal, setShowAddRdvModal] = useState(false)
  const [showAddProjetModal, setShowAddProjetModal] = useState(false)
  const [syncingStats, setSyncingStats] = useState(false)
  
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
        refetchStats() // Recharger les stats financières
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

  const recommendation = useMemo(() => {
    if (projets.length === 0) return null
    const rec = getProjectRecommendation(projets)
    if (!rec) return null
    
    const projet = projets.find(p => p.id === rec.projet_id)
    if (!projet) return null
    
    return {
      ...rec,
      nom: projet.nom,
    }
  }, [projets])

  const stats = useMemo(() => {
    const totalRdvJour = projets.reduce((sum, p) => sum + (p.rdv_realises_jour || 0), 0)
    const totalObjectifJour = projets.reduce((sum, p) => sum + p.objectif_quotidien, 0)
    const totalRdvMois = projets.reduce((sum, p) => sum + (p.rdv_realises_mois || 0), 0)
    const totalObjectifMois = projets.reduce((sum, p) => sum + p.objectif_mensuel, 0)
    
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

      {/* Statistiques Financières TimeOne */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Statistiques Financières</h2>
        <FinancialStatsCard
          totalCommission={financialStats.totalCommission}
          totalVentes={financialStats.totalVentes}
          montantPanier={financialStats.montantPanier}
          tauxValidation={financialStats.tauxValidation}
        />
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos Projets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projets.map((projet) => (
            <ProjectCard key={projet.id} projet={projet} onUpdate={refetchProjets} />
          ))}
        </div>
        {projets.length === 0 && (
          <div className="text-center py-12 glass-effect rounded-xl">
            <p className="text-gray-500">Aucun projet trouvé</p>
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
