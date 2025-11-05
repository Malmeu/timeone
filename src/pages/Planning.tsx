import { useState } from 'react'
import { RefreshCw, Calendar, Clock, Plus } from 'lucide-react'
import { usePlanning } from '@/hooks/usePlanning'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import AddPlanningModal from '@/components/AddPlanningModal'

export default function Planning() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { planning, loading, refetch } = usePlanning(selectedDate)
  const [showAddModal, setShowAddModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du planning...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning Dynamique</h1>
          <p className="text-gray-500 mt-1">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <div className="flex space-x-3">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un créneau
          </button>
          <button
            onClick={refetch}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Planning Timeline */}
      {planning.length > 0 ? (
        <div className="space-y-4">
          {planning.map((slot) => (
            <div
              key={slot.id}
              className="glass-effect rounded-xl p-6 card-shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 rounded-lg p-3">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {slot.creneau_debut.slice(0, 5)} - {slot.creneau_fin.slice(0, 5)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{slot.projet_nom}</span>
                    </div>
                    {slot.recommandation && (
                      <p className="text-sm text-gray-500 mt-1">{slot.recommandation}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {slot.taux_avancement.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">Avancement</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      slot.taux_avancement >= 100
                        ? 'bg-green-500'
                        : slot.taux_avancement >= 70
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(slot.taux_avancement, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-effect rounded-xl p-12 text-center">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Aucun créneau planifié</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aucun créneau horaire n'est défini pour cette date.
          </p>
        </div>
      )}

      {/* Recommandations */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">💡 Recommandations pour optimiser votre planning</h3>
        <div className="space-y-3">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">08h-10h :</span> Commencez par Hyundai (volume important, 2.27 RDV/jour). 
              C'est le projet avec le plus gros objectif quotidien.
            </p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <p className="text-sm text-purple-900">
              <span className="font-semibold">10h-12h :</span> Période productive avant la pause. Concentrez-vous sur 
              EBP, Sage PE, Quadra et 6XPOS en parallèle (objectifs moyens de 0.90-1.36 RDV/jour).
            </p>
          </div>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <p className="text-sm text-orange-900">
              <span className="font-semibold">13h-15h :</span> Après la pause, traitez Canal + et Danone. 
              Danone a un objectif plus élevé (1.36 RDV/jour), priorisez-le si nécessaire.
            </p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <p className="text-sm text-green-900">
              <span className="font-semibold">15h-17h :</span> Terminez avec Ayvens (0.45 RDV/jour). 
              Utilisez ce créneau pour rattraper les retards des autres projets si nécessaire.
            </p>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de créneau */}
      <AddPlanningModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={refetch}
        selectedDate={selectedDate}
      />
    </div>
  )
}
