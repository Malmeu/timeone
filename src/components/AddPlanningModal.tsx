import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProjects } from '@/hooks/useProjects'

interface AddPlanningModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  selectedDate: Date
}

export default function AddPlanningModal({ isOpen, onClose, onSuccess, selectedDate }: AddPlanningModalProps) {
  const { projets } = useProjects()
  const [formData, setFormData] = useState({
    projet_id: '',
    creneau_debut: '09:00',
    creneau_fin: '10:00',
    recommandation: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (projets.length > 0 && !formData.projet_id) {
      setFormData(prev => ({ ...prev, projet_id: projets[0].id as string }))
    }
  }, [projets, formData.projet_id])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('planning')
        .insert({
          projet_id: formData.projet_id,
          date: selectedDate.toISOString().split('T')[0],
          creneau_debut: formData.creneau_debut,
          creneau_fin: formData.creneau_fin,
          recommandation: formData.recommandation || null
        })

      if (error) throw error

      alert('Créneau ajouté avec succès !')
      setFormData({
        projet_id: projets[0]?.id as string || '',
        creneau_debut: '09:00',
        creneau_fin: '10:00',
        recommandation: ''
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding planning:', error)
      alert('Erreur lors de l\'ajout du créneau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Ajouter un créneau</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projet
            </label>
            <select
              value={formData.projet_id}
              onChange={(e) => setFormData({ ...formData, projet_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              {projets.map((projet) => (
                <option key={projet.id} value={projet.id}>
                  {projet.nom} {projet.statut === 'pause' && '(En pause)'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              <input
                type="time"
                value={formData.creneau_debut}
                onChange={(e) => setFormData({ ...formData, creneau_debut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de fin
              </label>
              <input
                type="time"
                value={formData.creneau_fin}
                onChange={(e) => setFormData({ ...formData, creneau_fin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recommandation (optionnel)
            </label>
            <textarea
              value={formData.recommandation}
              onChange={(e) => setFormData({ ...formData, recommandation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Ex: Prioriser ce projet en début de journée"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
