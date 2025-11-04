import { useState, useEffect } from 'react'
import { X, Edit2, Trash2, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Rdv {
  id: string
  date_heure: string
  operateur: string
  statut: string
}

interface RdvListModalProps {
  projetId: string
  projetNom: string
  onClose: () => void
  onUpdate: () => void
}

export default function RdvListModal({ projetId, projetNom, onClose, onUpdate }: RdvListModalProps) {
  const [rdvs, setRdvs] = useState<Rdv[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    date_heure: '',
    operateur: '',
    statut: '',
  })

  useEffect(() => {
    fetchRdvs()
  }, [projetId])

  async function fetchRdvs() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('rdv')
        .select('*')
        .eq('projet_id', projetId)
        .order('date_heure', { ascending: false })

      if (error) throw error
      setRdvs(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des RDV:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce RDV ?')) return

    try {
      const { error } = await supabase.from('rdv').delete().eq('id', id)
      if (error) throw error
      
      await fetchRdvs()
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du RDV')
    }
  }

  function startEdit(rdv: Rdv) {
    setEditingId(rdv.id)
    setEditForm({
      date_heure: new Date(rdv.date_heure).toISOString().slice(0, 16),
      operateur: rdv.operateur,
      statut: rdv.statut,
    })
  }

  async function handleUpdate() {
    if (!editingId) return

    try {
      const { error } = await supabase
        .from('rdv')
        .update({
          date_heure: editForm.date_heure,
          operateur: editForm.operateur,
          statut: editForm.statut,
        })
        .eq('id', editingId)

      if (error) throw error

      setEditingId(null)
      await fetchRdvs()
      onUpdate()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la mise à jour du RDV')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden card-shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Rendez-vous - {projetNom}</h2>
            <p className="text-sm text-gray-500 mt-1">{rdvs.length} RDV enregistré{rdvs.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : rdvs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rendez-vous enregistré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rdvs.map((rdv) => (
                <div
                  key={rdv.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  {editingId === rdv.id ? (
                    <div className="space-y-3">
                      <input
                        type="datetime-local"
                        value={editForm.date_heure}
                        onChange={(e) => setEditForm({ ...editForm, date_heure: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={editForm.operateur}
                        onChange={(e) => setEditForm({ ...editForm, operateur: e.target.value })}
                        placeholder="Opérateur"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={editForm.statut}
                        onChange={(e) => setEditForm({ ...editForm, statut: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="realise">Réalisé</option>
                        <option value="planifie">Planifié</option>
                        <option value="annule">Annulé</option>
                      </select>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdate}
                          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">
                            {format(new Date(rdv.date_heure), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              rdv.statut === 'realise'
                                ? 'bg-green-100 text-green-700'
                                : rdv.statut === 'planifie'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {rdv.statut === 'realise' ? 'Réalisé' : rdv.statut === 'planifie' ? 'Planifié' : 'Annulé'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Opérateur: {rdv.operateur}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(rdv)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rdv.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
