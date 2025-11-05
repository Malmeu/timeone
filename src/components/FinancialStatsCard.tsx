import { DollarSign, TrendingUp, ShoppingCart, Award } from 'lucide-react'

interface FinancialStatsCardProps {
  totalCommission: number
  totalVentes: number
  montantPanier: number
  tauxValidation: number
}

export default function FinancialStatsCard({
  totalCommission,
  totalVentes,
  montantPanier,
  tauxValidation
}: FinancialStatsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Commission Totale */}
      <div className="glass-effect rounded-xl p-6 card-shadow-lg border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Commission Totale</p>
            <p className="text-2xl font-bold text-green-600">
              {totalCommission.toFixed(2)}€
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Depuis TimeOne
        </div>
      </div>

      {/* Nombre de Ventes */}
      <div className="glass-effect rounded-xl p-6 card-shadow-lg border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ventes Réalisées</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalVentes}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Actions approuvées
        </div>
      </div>

      {/* Montant Panier Moyen */}
      <div className="glass-effect rounded-xl p-6 card-shadow-lg border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Panier Moyen</p>
            <p className="text-2xl font-bold text-purple-600">
              {montantPanier > 0 ? (montantPanier / totalVentes).toFixed(2) : '0.00'}€
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Par vente
        </div>
      </div>

      {/* Taux de Validation */}
      <div className="glass-effect rounded-xl p-6 card-shadow-lg border-2 border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Taux Validation</p>
            <p className="text-2xl font-bold text-orange-600">
              {tauxValidation.toFixed(0)}%
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Actions approuvées
        </div>
      </div>
    </div>
  )
}
