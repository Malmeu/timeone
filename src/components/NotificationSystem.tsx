import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error'
  message: string
  timestamp: Date
}

interface NotificationSystemProps {
  projets: any[]
}

export default function NotificationSystem({ projets }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    checkObjectives()
    checkHourlyAlerts()

    // Vérifier toutes les 5 minutes
    const interval = setInterval(() => {
      checkObjectives()
      checkHourlyAlerts()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [projets])

  function checkObjectives() {
    projets.forEach((projet) => {
      const tauxJour = projet.taux_avancement_jour || 0

      // Objectif journalier atteint
      if (tauxJour >= 100) {
        addNotification({
          type: 'success',
          message: `🎉 Objectif journalier atteint pour ${projet.nom} !`,
        })
      }
    })
  }

  function checkHourlyAlerts() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Heures de travail: 8h-12h et 13h-17h
    const isWorkingHours =
      (currentHour >= 8 && currentHour < 12) || (currentHour >= 13 && currentHour < 17)

    if (!isWorkingHours) return

    // Vérifier à 15h si les objectifs ne sont pas atteints
    if (currentHour === 15 && currentMinute < 5) {
      projets.forEach((projet) => {
        const tauxJour = projet.taux_avancement_jour || 0

        if (tauxJour < 100) {
          addNotification({
            type: 'warning',
            message: `⚠️ ${projet.nom} : Objectif journalier non atteint (${tauxJour.toFixed(0)}%). Il reste 2h de travail.`,
          })
        }
      })
    }

    // Vérifier à 11h (avant la pause)
    if (currentHour === 11 && currentMinute < 5) {
      projets.forEach((projet) => {
        const tauxJour = projet.taux_avancement_jour || 0

        if (tauxJour < 50) {
          addNotification({
            type: 'warning',
            message: `⚠️ ${projet.nom} : Retard important (${tauxJour.toFixed(0)}%). Accélérer avant la pause.`,
          })
        }
      })
    }

    // Vérifier à 16h30 (dernière ligne droite)
    if (currentHour === 16 && currentMinute >= 30 && currentMinute < 35) {
      projets.forEach((projet) => {
        const tauxJour = projet.taux_avancement_jour || 0

        if (tauxJour < 90) {
          addNotification({
            type: 'error',
            message: `🚨 ${projet.nom} : Objectif en danger (${tauxJour.toFixed(0)}%). Dernière demi-heure !`,
          })
        }
      })
    }
  }

  function addNotification(notif: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }

    setNotifications((prev) => {
      // Éviter les doublons
      const exists = prev.some(
        (n) => n.message === newNotif.message && Date.now() - n.timestamp.getTime() < 60000
      )
      if (exists) return prev

      return [newNotif, ...prev].slice(0, 5) // Garder max 5 notifications
    })

    // Auto-suppression après 10 secondes
    setTimeout(() => {
      removeNotification(newNotif.id)
    }, 10000)
  }

  function removeNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`glass-effect rounded-lg p-4 card-shadow-lg border-l-4 animate-slide-in ${
            notif.type === 'success'
              ? 'border-green-500 bg-green-50'
              : notif.type === 'warning'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-red-500 bg-red-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {notif.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle
                  className={`w-5 h-5 mt-0.5 ${
                    notif.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}
                />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    notif.type === 'success'
                      ? 'text-green-900'
                      : notif.type === 'warning'
                      ? 'text-yellow-900'
                      : 'text-red-900'
                  }`}
                >
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notif.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
