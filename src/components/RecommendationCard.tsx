import { Sparkles, ArrowRight } from 'lucide-react'
import { ProjetScore } from '@/types'

interface RecommendationCardProps {
  recommendation: ProjetScore & { nom: string }
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <div className="glass-effect rounded-xl p-6 card-shadow-lg border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-primary-100 rounded-lg p-2 mr-3">
            <Sparkles className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Projet Recommandé</h3>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{recommendation.nom}</h2>
          </div>
        </div>
        <div className="bg-primary-600 text-white rounded-full px-4 py-2 text-sm font-semibold">
          Score: {recommendation.score.toFixed(0)}
        </div>
      </div>

      <div className="bg-white/60 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">{recommendation.raison}</p>
      </div>

      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
        Commencer à travailler
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  )
}
