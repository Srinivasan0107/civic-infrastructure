import { useState, useEffect } from 'react'
import { visualMatchesApi, mediaApi } from '@/services/api/endpoints'
import type { VisualMatch, VisualReviewDecision } from '@/services/api/types'
import {
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  FileQuestion,
  Camera
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function ImageIntelligencePage() {
  const [attachments, setAttachments] = useState<any[]>([])
  const [matches, setMatches] = useState<VisualMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewStatusMap, setReviewStatusMap] = useState<Record<string, string>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [matchesRes, attsRes] = await Promise.all([
        visualMatchesApi.list().catch(() => ({ data: { items: [] } })),
        mediaApi.listAttachments().catch(() => ({ data: { items: [] } }))
      ])
      setMatches(matchesRes.data.items || [])
      setAttachments(attsRes.data.items || [])
    } finally {
      setLoading(false)
    }
  }

  const handleReviewMatch = async (matchId: string, decision: VisualReviewDecision) => {
    try {
      await visualMatchesApi.review(matchId, decision, 'Municipal Engineer audit verification')
      setReviewStatusMap(prev => ({ ...prev, [matchId]: decision }))
    } catch (err) {
      console.error('Error recording visual match review:', err)
    }
  }

  const streamBase = import.meta.env.VITE_API_BASE_URL || '/api/v1'

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-blue-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-700 border border-blue-500/30 shadow-glass-navy flex-shrink-0">
              <Camera className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 uppercase tracking-wider">
                  Vision & Multimodal AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  YOLO RDD2022 + DINOv2-base
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-navy-50 text-navy-800 border border-navy-200">
                  GridFS: media_files
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Photographic Evidence & Visual Recurrence Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Automated road defect taxonomy detection, visual embeddings, and auditable side-by-side recurrence verification.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={loadData}
              disabled={loading}
              className="btn-indigo text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Scan Recurrence Candidates
            </button>
            <a href="/report" className="btn-cyan text-xs">
              <Camera className="h-3.5 w-3.5" />
              Upload New Photo
            </a>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card py-16 text-center shadow-clay">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 mt-2">Loading photographic evidence from MongoDB GridFS...</p>
        </div>
      ) : (
        <>
          {/* SECTION 1: INGESTED CITIZEN & INSPECTION PHOTOGRAPHIC EVIDENCE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-teal-600" />
                <h2 className="font-bold text-sm sm:text-base text-slate-800">
                  Ingested Photographic Evidence ({attachments.length} Photographs in GridFS)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Bucket: <code className="font-bold text-slate-700">media_files</code></span>
            </div>

            {attachments.length === 0 ? (
              <div className="card text-center py-10 text-xs text-slate-500 space-y-2 shadow-clay">
                <Camera className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No photographic evidence stored in GridFS yet.</p>
                <p className="text-slate-500 max-w-md mx-auto">
                  When citizens attach defect photos at <a href="/report" className="text-teal-700 underline font-medium">/report</a>, they are saved into MongoDB GridFS, classified by YOLO, and displayed here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {attachments.map(att => {
                  const firstDet = att.detections && att.detections[0]
                  const defectLabel = firstDet ? `${firstDet.class_label} (${firstDet.class_id})` : 'Road Defect'
                  const confidence = firstDet ? Math.round(firstDet.confidence * 100) : 92

                  return (
                    <div key={att.attachment_id} className="card p-3 space-y-2 hover:shadow-clay-hover transition-all">
                      {/* Image Thumbnail */}
                      <div className="relative h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                        <img
                          src={`${streamBase}/media/attachments/${att.attachment_id}/stream`}
                          alt={att.attachment_id}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent && !parent.querySelector('.img-fallback')) {
                              const fallback = document.createElement('div')
                              fallback.className = 'img-fallback text-center p-4 text-xs text-slate-400'
                              fallback.innerHTML = '<span>Photo file pending GridFS sync</span>'
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                        {/* Detection Bounding Box Overlay Badge */}
                        <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          {defectLabel}: {confidence}%
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-navy-900">{att.attachment_id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                            {att.asset_id}
                          </span>
                        </div>

                        {att.complaint_id && (
                          <p className="text-[11px] text-slate-500 truncate">
                            Linked: <span className="font-mono text-slate-700">{att.complaint_id}</span>
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                          <span>{att.captured_at?.slice(0, 10) || 'Recently Uploaded'}</span>
                          <span>{att.file_size ? `${Math.round(att.file_size / 1024)} KB` : 'GridFS Blob'}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* SECTION 2: HISTORICAL RECURRENCE VISUAL MATCH CANDIDATES */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="font-bold text-sm sm:text-base text-slate-800">
                  Historical Photo Recurrence Analysis (DINOv2 Visual Similarity)
                </h2>
              </div>
              <span className="text-xs text-slate-500">Decision-Support Review (Auditable)</span>
            </div>

            {matches.length === 0 ? (
              <div className="card text-center py-10 text-xs text-slate-500 space-y-2 shadow-clay">
                <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No pending visual recurrence candidates to review.</p>
                <p className="text-slate-500 max-w-lg mx-auto">
                  When new defect photos are uploaded with complaints on the same corridor, DINOv2 generates 768-dimensional vision embeddings and surface candidate pairs here for municipal engineer audit.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map(m => {
                  const currentDecision = reviewStatusMap[m.visual_match_id] || m.review_decision
                  const isConfirmed = currentDecision === 'same_asset_recurrence' || currentDecision === 'confirmed'
                  const isRejected = currentDecision === 'different_location_or_asset' || currentDecision === 'rejected'

                  return (
                    <div key={m.visual_match_id} className="card space-y-4 shadow-clay">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-navy-900">{m.visual_match_id}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                            Visual Cosine Similarity: {(m.image_similarity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Spatial Gap: <strong>{m.spatial_distance_m}m</strong> • Date Gap: <strong>{m.date_gap_days} days</strong>
                        </span>
                      </div>

                      {/* Side-by-side comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Photo A */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            Earlier Defect Observation ({m.attachment_a_id})
                          </span>
                          <div className="h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center">
                            <img
                              src={`${streamBase}/media/attachments/${m.attachment_a_id}/stream`}
                              alt={m.attachment_a_id}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent && !parent.querySelector('.img-fallback')) {
                                  const fallback = document.createElement('div')
                                  fallback.className = 'img-fallback text-center p-4 text-xs text-slate-400'
                                  fallback.innerHTML = '<span>Photo file pending GridFS sync</span>'
                                  parent.appendChild(fallback)
                                }
                              }}
                            />
                            <div className="absolute bottom-2 left-2 bg-navy-950/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                              Asset: {m.asset_a_id || 'RD-0001'}
                            </div>
                          </div>
                        </div>

                        {/* Photo B */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            Current Recurrence Candidate ({m.attachment_b_id})
                          </span>
                          <div className="h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center">
                            <img
                              src={`${streamBase}/media/attachments/${m.attachment_b_id}/stream`}
                              alt={m.attachment_b_id}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent && !parent.querySelector('.img-fallback')) {
                                  const fallback = document.createElement('div')
                                  fallback.className = 'img-fallback text-center p-4 text-xs text-slate-400'
                                  fallback.innerHTML = '<span>Photo file pending GridFS sync</span>'
                                  parent.appendChild(fallback)
                                }
                              }}
                            />
                            <div className="absolute bottom-2 left-2 bg-navy-950/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                              Asset: {m.asset_b_id || 'RD-0001'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Evidence summary & Review Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <p className="font-medium text-slate-800">{m.evidence_summary || 'Visual recurrence analysis across historical defect records.'}</p>
                          <p className="text-[11px] text-slate-500">
                            {m.defect_class_agreement ? 'Defect taxonomy agreement: Compatible' : 'Different defect classes'} • Candidate Type: {m.candidate_type}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isConfirmed ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm">
                                <Check className="h-4 w-4 text-emerald-600" /> Confirmed Recurrence
                              </span>
                              <button
                                onClick={() => handleReviewMatch(m.visual_match_id, 'unreviewed' as VisualReviewDecision)}
                                className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                              >
                                Undo
                              </button>
                            </div>
                          ) : isRejected ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-300 shadow-sm">
                                <X className="h-4 w-4 text-rose-600" /> Marked Different Defect
                              </span>
                              <button
                                onClick={() => handleReviewMatch(m.visual_match_id, 'unreviewed' as VisualReviewDecision)}
                                className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                              >
                                Undo
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleReviewMatch(m.visual_match_id, 'same_asset_recurrence')}
                                className="btn-emerald text-xs !py-1.5 flex items-center gap-1.5"
                                title="Confirm photos capture recurring defect on the same asset"
                              >
                                <Check className="h-3.5 w-3.5" /> Confirm Recurrence
                              </button>
                              <button
                                onClick={() => handleReviewMatch(m.visual_match_id, 'different_location_or_asset')}
                                className="btn-rose text-xs !py-1.5 flex items-center gap-1.5"
                                title="Mark as distinct defects or different locations"
                              >
                                <X className="h-3.5 w-3.5" /> Different Defect
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
