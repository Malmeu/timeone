import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { Alerte } from '@/types'
import { formatDate, formatTime } from '@/lib/utils'

interface AlertCardProps {
  alerte: Alerte
}

export default function AlertCard({ alerte }: AlertCardProps) {
  const getAlertStyle = () => {
    switch (alerte.type) {
      case 'vert':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          textColor: 'text-green-900',
        }
      case 'rouge':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
        }
      case 'jaune':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-900',
        }
    }
  }

  const style = getAlertStyle()
  const Icon = style.icon
  const date = new Date(alerte.date)

  return (
    <div className={`${style.bg} ${style.border} border-l-4 rounded-lg p-4`}>
      <div className="flex items-start">
        <Icon className={`${style.iconColor} w-5 h-5 mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`${style.textColor} font-medium text-sm`}>{alerte.message}</p>
          {alerte.action_recommandee && (
            <p className="text-gray-600 text-xs mt-1">
              Action: {alerte.action_recommandee}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            {formatDate(date)} à {formatTime(date)}
          </p>
        </div>
      </div>
    </div>
  )
}
