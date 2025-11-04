import { useState } from 'react'
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react'
import { Projet } from '@/types'
import { getProgressColor, getProgressBgColor } from '@/lib/utils'
import RdvListModal from './RdvListModal'

interface ProjectCardProps {
  projet: Projet
  onUpdate?: () => void
}

export default function ProjectCard({ projet, onUpdate }: ProjectCardProps) {
  const [showRdvModal, setShowRdvModal] = useState(false)
  const tauxJour = projet.taux_avancement_jour || 0
  const tauxMois = projet.taux_avancement_mois || 0

  const getAlertColor = (taux: number) => {
    if (taux >= 100) return 'bg-green-50 border-green-200'
    if (taux >= 70) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className={`glass-effect rounded-xl p-6 card-shadow-lg border-2 ${getAlertColor(tauxJour)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{projet.nom}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Rentabilité: {projet.rentabilite_estimee}€
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {tauxJour >= 100 ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
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
          <div className="text-xl font-bold text-gray-900">{projet.solde_rdv}</div>
        </div>
        <button
          onClick={() => setShowRdvModal(true)}
          className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Voir RDV
        </button>
      </div>

      {/* Modal RDV */}
      {showRdvModal && (
        <RdvListModal
          projetId={projet.id}
          projetNom={projet.nom}
          onClose={() => setShowRdvModal(false)}
          onUpdate={() => {
            setShowRdvModal(false)
            onUpdate?.()
          }}
        />
      )}
    </div>
  )
}
