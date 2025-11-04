import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import NotificationCenter from './NotificationCenter'
import { useNotifications } from '@/contexts/NotificationContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { notifications, markAsRead, clearAll } = useNotifications()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Planning', href: '/planning', icon: Calendar },
    { name: 'Projets', href: '/projects', icon: FolderKanban },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">TimeOne</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="glass-effect border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Dashboard de Suivi & Optimisation
            </div>
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onClearAll={clearAll}
            />
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
