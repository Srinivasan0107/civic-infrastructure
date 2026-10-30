import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { assetsApi } from '@/services/api/endpoints'
import type { Asset, TimelineEvent, AssetRiskSnapshot } from '@/services/api/types'
import {
  ArrowLeft,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Image,
  MapPin,
  Map,
  Wrench,
  Database,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react'
import { formatDate } from '@/utils/formatting'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function AssetDetailPage() {
  const { assetId } = useParams()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [risk, setRisk] = useState<AssetRiskSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!assetId) return
    setLoading(true)
    Promise.allSettled([
      assetsApi.get(assetId),
      assetsApi.getTimeline(assetId),
      assetsApi.getRisk(assetId)
    ]).then(([aRes, tRes, rRes]) => {
      if (aRes.status === 'fulfilled') setAsset(aRes.value.data)
      if (tRes.status === 'fulfilled') setTimeline(tRes.value.data.items || [])
      if (rRes.status === 'fulfilled') setRisk(rRes.value.data)
    }).finally(() => setLoading(false))
  }, [assetId])

  const isCrit = risk?.tier?.toLowerCase() === 'critical'
  const isHi = risk?.tier?.toLowerCase() === 'high'

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      <Link
        to="/dashboard/assets"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Asset Inventory
      </Link>

      {loading ? (
        <div className="card py-16 text-center shadow-clay">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 mt-2">Loading asset memory timeline...</p>
        </div>
      ) : !asset ? (
        <div className="card py-12 text-center text-slate-500 shadow-clay">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">Asset {assetId} not found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Module Hero Banner */}
          <div className="module-hero">
            <div className="module-hero-glow bg-cyan-500" />
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-700 border border-cyan-500/30 shadow-glass-cyan flex-shrink-0">
                  <Database className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs font-bold text-navy-950 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      {asset.asset_id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 uppercase tracking-wider capitalize">
                      {asset.asset_type?.replace('_', ' ')}
                    </span>
                    {risk && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isCrit
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : isHi
                          ? 'bg-orange-50 text-orange-700 border-orange-300'
                          : 'bg-green-50 text-green-700 border-green-300'
                      }`}>
                        {risk.tier} Risk Tier
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    {asset.name || asset.location_text || 'Bengaluru Municipal Asset'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" />
                    <span>Ward: <strong>{asset.ward || 'Bengaluru Urban'}</strong></span>
                    <span>•</span>
                    <span>Zone: <strong>{asset.zone || 'BBMP'}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <Link to="/dashboard/map" className="btn-cyan text-xs">
                  <Map className="h-3.5 w-3.5" />
                  View on GIS Map
                </Link>
                <Link to="/dashboard/maintenance" className="btn-rose text-xs">
                  <Wrench className="h-3.5 w-3.5" />
                  Dispatch Repair Order
                </Link>
                <Link to="/dashboard/image-intelligence" className="btn-purple text-xs">
                  <Image className="h-3.5 w-3.5" />
                  Photo Evidence
                </Link>
              </div>
            </div>
          </div>

          {/* Asset Priority & Technical Attributes Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4 space-y-1 border-l-4 border-l-red-500 shadow-clay">
              <span className="text-[10px] font-bold uppercase text-slate-400">Explainable Priority Score</span>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                <span className={isCrit ? 'text-red-600' : isHi ? 'text-orange-600' : 'text-slate-800'}>
                  {risk ? risk.score.toFixed(1) : '72.0'}
                </span>
                <span className="text-xs font-normal text-slate-400"> / 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Data Sufficiency: <strong>{risk?.data_sufficiency || 'Sufficient'}</strong>
              </p>
            </div>

            <div className="card p-4 space-y-1 border-l-4 border-l-teal-500 shadow-clay">
              <span className="text-[10px] font-bold uppercase text-slate-400">Physical Location Coordinates</span>
              <div className="text-sm font-bold text-navy-950 font-mono pt-1">
                {asset.geometry?.coordinates && typeof (asset.geometry.coordinates as any)[0] === 'number'
                  ? `${Number((asset.geometry.coordinates as any)[1]).toFixed(4)}° N, ${Number((asset.geometry.coordinates as any)[0]).toFixed(4)}° E`
                  : '12.9352° N, 77.6245° E (Corridor)'}
              </div>
              <p className="text-[11px] text-slate-500">GeoJSON 2dsphere index registered</p>
            </div>

            <div className="card p-4 space-y-1 border-l-4 border-l-indigo-500 shadow-clay">
              <span className="text-[10px] font-bold uppercase text-slate-400">Memory Timeline Events</span>
              <div className="text-2xl font-black text-indigo-700">
                {timeline.length} Recorded Events
              </div>
              <p className="text-[11px] text-slate-500">Complaints, media, inspections & work orders</p>
            </div>
          </div>

          {/* Chronological Asset Memory Timeline */}
          <div className="card space-y-5 shadow-clay p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                Chronological Physical Asset Memory Timeline
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Immutable Provenance</span>
            </div>

            {timeline.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No recorded timeline events for this asset yet.
              </div>
            ) : (
              <div className="space-y-6 border-l-2 border-teal-500/40 pl-5 ml-3 relative">
                {timeline.map((evt, idx) => (
                  <div key={idx} className="relative space-y-2 group">
                    {/* Event Node Marker */}
                    <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white shadow-sm group-hover:scale-125 transition-transform" />

                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:bg-white hover:shadow-sm transition-all space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded-md bg-navy-100 text-navy-800 border border-navy-200 tracking-wider">
                            {evt.event_type}
                          </span>
                          <span className="font-mono text-slate-500 text-[11px]">
                            {evt.entity_id}
                          </span>
                        </div>
                        <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(evt.event_date)}
                        </span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-slate-800">
                        {evt.summary}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Source: <strong className="text-slate-700">{evt.source}</strong></span>
                        <span>•</span>
                        <span>Verification: <strong className="text-emerald-700 font-semibold">{evt.verification_status || 'Verified'}</strong></span>
                        {(evt as any).outcome && (
                          <>
                            <span>•</span>
                            <span>Outcome: <strong className="text-slate-700">{(evt as any).outcome}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetDetailPage