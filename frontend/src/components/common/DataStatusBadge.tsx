import { cn } from '@/utils/cn'
import type { DataStatus } from '@/services/api/types'

interface DataStatusBadgeProps {
  status: DataStatus
  className?: string
}

const STATUS_CONFIG: Record<DataStatus, { label: string; className: string; dot: string }> = {
  live: { label: 'Live', className: 'badge-live', dot: 'bg-green-500' },
  partial: { label: 'Partial', className: 'badge-partial', dot: 'bg-blue-500' },
  demo: { label: 'Demo', className: 'badge-demo', dot: 'bg-amber-500' },
  unavailable: { label: 'Unavailable', className: 'badge-unavailable', dot: 'bg-red-500' },
}

export function DataStatusBadge({ status, className }: DataStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={cn(config.className, className)}>
      <span className={cn('inline-block w-1.5 h-1.5 rounded-full', config.dot)} aria-hidden />
      {config.label}
    </span>
  )
}
