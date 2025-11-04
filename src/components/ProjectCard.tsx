// @ts-nocheck
import { useState } from 'react'
import { TrendingUp, TrendingDown, Target, Calendar, Pause, Play } from 'lucide-react'
import { Projet } from '@/types'
import { getProgressColor, getProgressBgColor } from '@/lib/utils'
import RdvListModal from './RdvListModal'
import { supabase } from '@/lib/supabase'

interface ProjectCardProps {
  projet: Projet
  onUpdate?: () => void
}

export default function ProjectCard({ projet, onUpdate }: ProjectCardProps) {
  const [showRdvModal, setShowRdvModal] = useState(false)
  const [isPausing, setIsPausing] = useState(false)
  const tauxJour = projet.taux_avancement_jour || 0
  const tauxMois = projet.taux_avancement_mois || 0
  const isPaused = projet.statut === 'en_pause'

  const getAlertColor = (taux: number) => {
    if (isPaused) return 'bg-gray-50 border-gray-300'
    if (taux >= 100) return 'bg-green-50 border-green-200'
    if (taux >= 70) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const togglePause = async () => {
    setIsPausing(true)
    try {
      const newStatut = isPaused ? 'actif' : 'en_pause'
      const { error } = await supabase
        .from('projets')
        .update({ statut: newStatut } as any)
        .eq('id', projet.id)

      if (error) throw error
      
      onUpdate?.()
    } catch (error) {
      console.error('Erreur lors de la mise en pause:', error)
      alert('Erreur lors de la mise en pause du projet')
    } finally {
      setIsPausing(false)
    }
  }

  return (
    <div className={`glass-effect rounded-xl p-6 card-shadow-lg border-2 ${getAlertColor(tauxJour)} ${isPaused ? 'opacity-60 grayscale' : ''} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className={`text-lg font-semibold ${isPaused ? 'text-gray-600' : 'text-gray-900'}`}>{projet.nom}</h3>
            {isPaused && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-300 text-gray-800 rounded-full">
                ⏸ En pause
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Rentabilité: {projet.rentabilite_estimee}€
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePause}
            disabled={isPausing}
            className={`p-2 rounded-lg transition-colors ${
              isPaused 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            } disabled:opacity-50`}
            title={isPaused ? 'Reprendre le projet' : 'Mettre en pause'}
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>
          {!isPaused && (
            <>
              {tauxJour >= 100 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Objectifs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/50 rounded-lg p-3">
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <Target className="w-3 h-3 mr-1" />
            Objectif Jour
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {projet.rdv_realises_jour || 0}/{projet.objectif_quotidien}
          </div>
        </div>
        <div className="bg-white/50 rounded-lg p-3">
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <Target className="w-3 h-3 mr-1" />
            Objectif Mois
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {projet.rdv_realises_mois || 0}/{projet.objectif_mensuel}
          </div>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        {/* Journée */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Avancement Journée</span>
            <span className={`font-semibold ${getProgressColor(tauxJour)}`}>
              {tauxJour.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getProgressBgColor(tauxJour)} transition-all duration-500`}
              style={{ width: `${Math.min(tauxJour, 100)}%` }}
            />
          </div>
        </div>

        {/* Mois */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Avancement Mois</span>
            <span className={`font-semibold ${getProgressColor(tauxMois)}`}>
              {tauxMois.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getProgressBgColor(tauxMois)} transition-all duration-500`}
              style={{ width: `${Math.min(tauxMois, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Solde et Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">Solde RDV restant</div>
          <div className={`text-xl font-bold ${isPaused ? 'text-gray-600' : 'text-gray-900'}`}>{projet.solde_rdv}</div>
        </div>
        {isPaused ? (
          <div className="flex items-center px-3 py-2 text-sm bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
            <Calendar className="w-4 h-4 mr-1" />
            Projet en pause
          </div>
        ) : (
          <button
            onClick={() => setShowRdvModal(true)}
            className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Voir RDV
          </button>
        )}
      </div>

      {/* Modal RDV */}
      {showRdvModal && (
        <RdvListModal
          projetId={projet.id}
          projetNom={projet.nom}
          onClose={() => {
            setShowRdvModal(false)
            onUpdate?.() // Rafraîchir les données du projet quand on ferme le modal
          }}
          onUpdate={() => {
            setShowRdvModal(false)
            onUpdate?.()
          }}
          onRefresh={() => {
            onUpdate?.() // Rafraîchir sans fermer le modal
          }}
        />
      )}
    </div>
  )
}
