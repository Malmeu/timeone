import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'text-green-600'
  if (percentage >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

export function getProgressBgColor(percentage: number): string {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}
