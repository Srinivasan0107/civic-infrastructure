import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
  href: string
  count?: number
  countLabel?: string
  className?: string
}

export function ServiceCard({ icon, title, description, href, count, countLabel, className }: ServiceCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'card group flex flex-col gap-3 hover:border-navy-300 hover:shadow-card-hover transition-all duration-200',
        className
      )}
      aria-label={`${title}: ${description}`}
    >
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-lg bg-navy-50 text-navy-700 group-hover:bg-navy-100 transition-colors" aria-hidden>
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-navy-600 transition-colors" aria-hidden />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800 group-hover:text-navy-800 transition-colors">{title}</h3>
        <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">{description}</p>
      </div>
      {count !== undefined && (
        <div className="pt-2 border-t border-civic-border text-xs text-slate-400">
          <span className="font-medium text-slate-600">{count.toLocaleString()}</span>{' '}
          {countLabel}
        </div>
      )}
    </Link>
  )
}
