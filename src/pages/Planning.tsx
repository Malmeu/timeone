import { useState } from 'react'
import { RefreshCw, Calendar, Clock } from 'lucide-react'
import { usePlanning } from '@/hooks/usePlanning'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Planning() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { planning, loading, refetch } = usePlanning(selectedDate)

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

      {/* Légende */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Répartition horaire optimisée</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700">08-10</span>
            </div>
            <span className="text-sm text-gray-600">Hyundai</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-700">10-12</span>
            </div>
            <span className="text-sm text-gray-600">EBP, Sage PE, Quadra, 6XPOS</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-700">13-15</span>
            </div>
            <span className="text-sm text-gray-600">Canal +, Danone</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-green-700">15-17</span>
            </div>
            <span className="text-sm text-gray-600">Ayvens</span>
          </div>
        </div>
      </div>
    </div>
  )
}
