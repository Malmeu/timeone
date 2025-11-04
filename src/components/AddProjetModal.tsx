// @ts-nocheck
import { useState } from 'react'
import { X, Plus, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AddProjetModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddProjetModal({ onClose, onSuccess }: AddProjetModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    objectif_quotidien: '',
    objectif_mensuel: '',
    rentabilite_estimee: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('projets').insert([{
        nom: formData.nom,
        objectif_quotidien: parseFloat(formData.objectif_quotidien),
        objectif_mensuel: parseInt(formData.objectif_mensuel),
        rentabilite_estimee: parseFloat(formData.rentabilite_estimee),
        solde_rdv: parseInt(formData.objectif_mensuel), // Solde initial = objectif mensuel
      }] as any)

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du projet:', error)
      alert('Erreur lors de l\'ajout du projet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 rounded-lg p-2">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nouveau Projet</h2>
              <p className="text-sm text-gray-500">Ajoutez un nouveau projet à votre dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom du projet */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du Projet *
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Ex: Danone, Hyundai, EBP..."
            />
          </div>

          {/* Objectif Quotidien */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Objectif Quotidien (RDV/jour) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.objectif_quotidien}
              onChange={(e) => setFormData({ ...formData, objectif_quotidien: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Ex: 1.36"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre de RDV à réaliser par jour (peut être décimal)
            </p>
          </div>

          {/* Objectif Mensuel */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Objectif Mensuel (RDV/mois) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.objectif_mensuel}
              onChange={(e) => setFormData({ ...formData, objectif_mensuel: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Ex: 30"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre total de RDV à réaliser dans le mois
            </p>
          </div>

          {/* Rentabilité Estimée */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rentabilité Estimée (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.rentabilite_estimee}
              onChange={(e) => setFormData({ ...formData, rentabilite_estimee: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Ex: 0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Rentabilité estimée du projet en euros
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Astuce :</span> Le solde RDV sera automatiquement calculé en fonction de vos RDV réalisés.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter le Projet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
