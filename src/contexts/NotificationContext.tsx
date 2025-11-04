import { createContext, useContext, useState, ReactNode } from 'react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  showBanner: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [bannerNotif, setBannerNotif] = useState<Notification | null>(null)

  function addNotification(notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotif, ...prev].slice(0, 50)) // Garder max 50 notifications
  }

  function showBanner(notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    setBannerNotif(newNotif)
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50))

    // Auto-suppression après 5 secondes
    setTimeout(() => {
      setBannerNotif(null)
    }, 5000)
  }

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function clearAll() {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, clearAll, showBanner }}
    >
      {children}
      
      {/* Banner Notification */}
      {bannerNotif && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div
            className={`glass-effect rounded-lg p-4 card-shadow-lg border-l-4 ${
              bannerNotif.type === 'success'
                ? 'border-green-500 bg-green-50'
                : bannerNotif.type === 'warning'
                ? 'border-yellow-500 bg-yellow-50'
                : bannerNotif.type === 'error'
                ? 'border-red-500 bg-red-50'
                : 'border-blue-500 bg-blue-50'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                bannerNotif.type === 'success'
                  ? 'text-green-900'
                  : bannerNotif.type === 'warning'
                  ? 'text-yellow-900'
                  : bannerNotif.type === 'error'
                  ? 'text-red-900'
                  : 'text-blue-900'
              }`}
            >
              {bannerNotif.message}
            </p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
