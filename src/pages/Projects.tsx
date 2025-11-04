import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/ProjectCard'
import AddRdvModal from '@/components/AddRdvModal'
import AddProjetModal from '@/components/AddProjetModal'

export default function Projects() {
  const { projets, loading, refetch } = useProjects()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddRdvModal, setShowAddRdvModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Projets</h1>
          <p className="text-gray-500 mt-1">
            {projets.length} projet{projets.length > 1 ? 's' : ''} actif{projets.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddRdvModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un RDV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
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

      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projets.map((projet) => (
          <ProjectCard key={projet.id} projet={projet} onUpdate={refetch} />
        ))}
      </div>

      {projets.length === 0 && (
        <div className="text-center py-16 glass-effect rounded-xl">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre premier projet pour suivre vos objectifs
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer un projet
            </button>
          </div>
        </div>
      )}

      {/* Modal d'ajout de projet */}
      {showAddModal && (
        <AddProjetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            refetch()
            setShowAddModal(false)
          }}
        />
      )}

      {/* Modal d'ajout de RDV */}
      {showAddRdvModal && (
        <AddRdvModal
          projets={projets}
          onClose={() => setShowAddRdvModal(false)}
          onSuccess={() => {
            refetch()
            setShowAddRdvModal(false)
          }}
        />
      )}
    </div>
  )
}
