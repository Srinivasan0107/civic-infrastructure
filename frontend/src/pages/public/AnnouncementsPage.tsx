import { useEffect, useState } from 'react'
import { announcementsApi } from '@/services/api/endpoints'
import type { Announcement } from '@/services/api/types'
import { Bell, AlertCircle, Info } from 'lucide-react'
import { formatDate } from '@/utils/formatting'

export function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    announcementsApi.list().then(res => {
      setItems(res.data.items)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Public Advisories & Works Updates</h1>
      <p className="text-slate-500 text-sm">Official notifications regarding infrastructure drives and maintenance works.</p>

      {loading ? (
        <div className="space-y-4">
          <div className="card skeleton h-20" />
          <div className="card skeleton h-20" />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(a => (
            <div key={a.id} className="card space-y-2 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="uppercase font-semibold text-amber-700">{a.type}</span>
                <span>{formatDate(a.published_at)}</span>
              </div>
              <h2 className="text-base font-bold text-slate-800">{a.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{a.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
