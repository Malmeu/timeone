import { RefreshCw, Calendar } from 'lucide-react'

export default function Planning() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning Dynamique</h1>
          <p className="text-gray-500 mt-1">Gestion des créneaux et répartition optimisée</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </button>
      </div>

      {/* Placeholder */}
      <div className="glass-effect rounded-xl p-12 text-center">
        <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Planning en développement</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Cette section permettra de gérer les créneaux horaires et d'afficher les recommandations
          de projets à traiter selon l'état d'avancement et les priorités.
        </p>
        <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
          <p className="text-sm text-yellow-800">
            Fonctionnalité à implémenter : vue calendrier, créneaux horaires, attribution automatique
          </p>
        </div>
      </div>

      {/* Aperçu des fonctionnalités prévues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Créneaux Horaires</h3>
          <p className="text-sm text-gray-600">
            Définition et gestion des plages horaires de travail pour chaque projet
          </p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Attribution Automatique</h3>
          <p className="text-sm text-gray-600">
            Algorithme d'affectation intelligente selon les retards et priorités
          </p>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Recommandations</h3>
          <p className="text-sm text-gray-600">
            Suggestions contextualisées pour optimiser la répartition du temps
          </p>
        </div>
      </div>
    </div>
  )
}
