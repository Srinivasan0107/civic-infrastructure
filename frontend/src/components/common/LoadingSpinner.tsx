import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const SIZE = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
}

export function LoadingSpinner({ size = 'md', className, label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)} role="status">
      <span
        className={cn(
          'rounded-full border-current border-t-transparent animate-spin',
          SIZE[size]
        )}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-24" role="status">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" className="text-navy-700" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card space-y-3', className)} aria-hidden="true">
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <tr aria-hidden="true">
      <td className="px-4 py-3"><div className="skeleton h-4 w-24 rounded" /></td>
      <td className="px-4 py-3"><div className="skeleton h-4 w-48 rounded" /></td>
      <td className="px-4 py-3"><div className="skeleton h-4 w-20 rounded" /></td>
      <td className="px-4 py-3"><div className="skeleton h-4 w-16 rounded" /></td>
    </tr>
  )
}
