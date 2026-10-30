import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="mb-4 text-slate-300" aria-hidden>
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

interface ApiErrorStateProps {
  error: Error | null
  onRetry?: () => void
  className?: string
}

export function ApiErrorState({ error, onRetry, className }: ApiErrorStateProps) {
  const message = error?.message ?? 'Failed to load data'
  const isUnavailable = message.includes('503') || message.includes('Network') || message.includes('ECONNREFUSED')

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="card max-w-sm w-full space-y-3">
        <p className="text-sm font-medium text-red-700">
          {isUnavailable ? 'Service Unavailable' : 'Error Loading Data'}
        </p>
        <p className="text-xs text-slate-500">
          {isUnavailable
            ? 'The backend service is not reachable. Please ensure the server is running.'
            : message}
        </p>
        {onRetry && (
          <button onClick={onRetry} className="btn-secondary text-sm mx-auto">
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
