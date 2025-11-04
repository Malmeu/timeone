import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Projet } from '@/types'

interface AddRdvModalProps {
  projets: Projet[]
  onClose: () => void
  onSuccess: () => void
}

export default function AddRdvModal({ projets, onClose, onSuccess }: AddRdvModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projet_id: '',
    date_heure: '', // Pas de date par défaut pour permettre les dates antérieures
    operateur: '',
    statut: 'realise',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('rdv').insert([
        {
          projet_id: formData.projet_id,
          date_heure: formData.date_heure,
          operateur: formData.operateur,
          statut: formData.statut,
        },
      ])

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du RDV:', error)
      alert('Erreur lors de l\'ajout du RDV')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full card-shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ajouter un RDV</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Projet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projet *
            </label>
            <select
              required
              value={formData.projet_id}
              onChange={(e) => setFormData({ ...formData, projet_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionner un projet</option>
              {projets.map((projet) => (
                <option key={projet.id} value={projet.id}>
                  {projet.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date et Heure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date et Heure *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.date_heure}
              onChange={(e) => setFormData({ ...formData, date_heure: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              max={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500 mt-1">Vous pouvez sélectionner une date antérieure</p>
          </div>

          {/* Opérateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opérateur *
            </label>
            <input
              type="text"
              required
              value={formData.operateur}
              onChange={(e) => setFormData({ ...formData, operateur: e.target.value })}
              placeholder="Nom de l'opérateur"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="realise">Réalisé</option>
              <option value="planifie">Planifié</option>
              <option value="annule">Annulé</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                'Ajout...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
