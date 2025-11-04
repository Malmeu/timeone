import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export default function NotificationCenter({ notifications, onMarkAsRead, onClearAll }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Tout effacer
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => onMarkAsRead(notif.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {notif.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : notif.type === 'warning' ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : notif.type === 'error' ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : (
                            <Info className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
