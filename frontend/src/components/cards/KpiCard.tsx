import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { DataStatusBadge } from '@/components/common/DataStatusBadge'
import type { DataStatus, KpiValue } from '@/services/api/types'
import { formatNumber } from '@/utils/formatting'

interface KpiCardProps {
  title: string
  kpi: KpiValue
  icon?: ReactNode
  dataStatus: DataStatus
  className?: string
}

export function KpiCard({ title, kpi, icon, dataStatus, className }: KpiCardProps) {
  const valueDisplay = kpi.value !== null ? formatNumber(kpi.value) : '—'
  const trendSign = kpi.comparison_delta !== null
    ? kpi.comparison_delta > 0 ? 'up' : kpi.comparison_delta < 0 ? 'down' : 'neutral'
    : null

  return (
    <div className={cn('card space-y-3', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-800">{valueDisplay}</span>
            {kpi.unit && kpi.unit !== 'count' && (
              <span className="text-sm text-slate-500">{kpi.unit}</span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-navy-50 text-navy-700" aria-hidden>
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {trendSign && kpi.comparison_period && (
        <div className="flex items-center gap-1.5 text-xs">
          {trendSign === 'up' && <TrendingUp className="h-3.5 w-3.5 text-red-500" aria-hidden />}
          {trendSign === 'down' && <TrendingDown className="h-3.5 w-3.5 text-green-500" aria-hidden />}
          {trendSign === 'neutral' && <Minus className="h-3.5 w-3.5 text-slate-400" aria-hidden />}
          <span className={cn(
            trendSign === 'up' ? 'text-red-600' : trendSign === 'down' ? 'text-green-600' : 'text-slate-500'
          )}>
            {kpi.comparison_delta !== null ? `${Math.abs(kpi.comparison_delta)}% vs ${kpi.comparison_period}` : ''}
          </span>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between pt-1 border-t border-civic-border">
        <DataStatusBadge status={dataStatus} />
        {kpi.coverage_note && (
          <span className="text-xs text-slate-400 text-right max-w-[10rem] truncate" title={kpi.coverage_note}>
            {kpi.coverage_note}
          </span>
        )}
      </div>
    </div>
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="card space-y-3" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-8 w-16 rounded" />
        </div>
        <div className="skeleton h-10 w-10 rounded-lg" />
      </div>
      <div className="skeleton h-3 w-32 rounded" />
      <div className="flex justify-between pt-1 border-t border-civic-border">
        <div className="skeleton h-4 w-12 rounded-badge" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  )
}
