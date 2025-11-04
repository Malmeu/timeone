import { useEffect, useRef } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'

interface Project {
  id: string
  nom: string
  taux_avancement_jour?: number
  taux_avancement_mois?: number
}

export function useNotificationMonitor(projets: Project[]) {
  const { addNotification, showBanner } = useNotifications()
  const lastCheckRef = useRef<{ [key: string]: number }>({})

  useEffect(() => {
    if (projets.length === 0) return

    checkObjectives()
    checkHourlyAlerts()

    // Vérifier toutes les 2 minutes
    const interval = setInterval(() => {
      checkObjectives()
      checkHourlyAlerts()
    }, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [projets])

  function checkObjectives() {
    projets.forEach((projet) => {
      const tauxJour = projet.taux_avancement_jour || 0
      const key = `objective_${projet.id}`
      const lastTaux = lastCheckRef.current[key] || 0

      // Objectif journalier atteint (et n'était pas atteint avant)
      if (tauxJour >= 100 && lastTaux < 100) {
        const notif = {
          type: 'success' as const,
          message: `🎉 Objectif journalier atteint pour ${projet.nom} !`,
        }
        addNotification(notif)
        showBanner(notif)
      }

      lastCheckRef.current[key] = tauxJour
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

    const checkKey = `${currentHour}:${Math.floor(currentMinute / 5)}`
    
    // Vérifier à 15h
    if (currentHour === 15 && currentMinute < 5 && !lastCheckRef.current[`alert_15_${checkKey}`]) {
      projets.forEach((projet) => {
        const tauxJour = projet.taux_avancement_jour || 0

        if (tauxJour < 100) {
          const notif = {
            type: 'warning' as const,
            message: `⚠️ ${projet.nom} : Objectif journalier non atteint (${tauxJour.toFixed(0)}%). Il reste 2h de travail.`,
          }
          addNotification(notif)
          showBanner(notif)
        }
      })
      lastCheckRef.current[`alert_15_${checkKey}`] = 1
    }

    // Vérifier à 11h (avant la pause)
    if (currentHour === 11 && currentMinute < 5 && !lastCheckRef.current[`alert_11_${checkKey}`]) {
      projets.forEach((projet) => {
        const tauxJour = projet.taux_avancement_jour || 0

        if (tauxJour < 50) {
          const notif = {
            type: 'warning' as const,
            message: `⚠️ ${projet.nom} : Retard important (${tauxJour.toFixed(0)}%). Accélérer avant la pause.`,
          }
          addNotification(notif)
          showBanner(notif)
        }
      })
      lastCheckRef.current[`alert_11_${checkKey}`] = 1
    }

    // Vérifier à 16h30 (dernière ligne droite)
    if (currentHour === 16 && currentMinute >= 30 && currentMinute < 35 && !lastCheckRef.current[`alert_1630_${checkKey}`]) {
      projets.forEach((projet) => {
        const tauxJour = projet.taux_avancement_jour || 0

        if (tauxJour < 90) {
          const notif = {
            type: 'error' as const,
            message: `🚨 ${projet.nom} : Objectif en danger (${tauxJour.toFixed(0)}%). Dernière demi-heure !`,
          }
          addNotification(notif)
          showBanner(notif)
        }
      })
      lastCheckRef.current[`alert_1630_${checkKey}`] = 1
    }
  }
}
