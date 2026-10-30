import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { semanticApi } from '@/services/api/endpoints'
import type {
  SemanticMatch,
  ReviewDecision
} from '@/services/api/types'
import {
  Sparkles,
  Search,
  Check,
  X,
  MapPin,
  Clock,
  AlertTriangle,
  Compass,
  FileText,
  ShieldCheck,
  Filter,
  CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function SemanticAnalysisPage() {
  const { t } = useTranslation()
  const [matches, setMatches] = useState<SemanticMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [reviewStatusMap, setReviewStatusMap] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const res = await semanticApi.listMatches({ page: 1, page_size: 40 })
      setMatches(res.data.items || [])
    } catch (err) {
      console.error('Error fetching semantic matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewDecision = async (matchId: string, decision: ReviewDecision) => {
    try {
      await semanticApi.reviewMatch(matchId, decision, 'Municipal Engineer operational audit')
      setReviewStatusMap(prev => ({ ...prev, [matchId]: decision }))
    } catch (err) {
      console.error('Error recording review decision:', err)
    }
  }

  const filteredMatches = matches.filter(m => {
    const currentStatus = reviewStatusMap[m.match_id] || m.review_decision || 'unreviewed'
    const matchesStatus = filterStatus === 'all' || currentStatus === filterStatus

    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      m.match_id.toLowerCase().includes(q) ||
      m.complaint_a_id.toLowerCase().includes(q) ||
      m.complaint_b_id.toLowerCase().includes(q) ||
      (m.asset_id && m.asset_id.toLowerCase().includes(q)) ||
      (m.ward && m.ward.toLowerCase().includes(q)) ||
      (m.complaint_a_text && m.complaint_a_text.toLowerCase().includes(q)) ||
      (m.complaint_b_text && m.complaint_b_text.toLowerCase().includes(q))

    return matchesStatus && matchesQuery
  })

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="module-hero">
        <div className="module-hero-glow bg-purple-500" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-700 border border-purple-500/30 shadow-glass-purple flex-shrink-0">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 uppercase tracking-wider">
                  AI NLP Intelligence
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  intfloat/multilingual-e5-base (768-dim)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  KN • EN • HI • TA • TE Supported
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Multilingual Semantic Complaint Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Audit AI-discovered candidate complaint relationships, compare evidence across languages, and link civic assets.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={fetchMatches}
              disabled={loading}
              className="btn-purple text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Re-scan Semantic Candidates
            </button>
            <Link to="/dashboard/map" className="btn-cyan text-xs">
              <Compass className="h-3.5 w-3.5" />
              Spatial Heatmap
            </Link>
          </div>
        </div>
      </div>

      {/* Municipal Search & Filter Bar */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-3 shadow-clay">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search complaint matches by text, ward, or asset ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input text-xs pl-9 py-2 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-purple-600" /> Filter State:
          </span>
          {[
            { id: 'all', label: 'All Candidates' },
            { id: 'unreviewed', label: 'Unreviewed' },
            { id: 'same_asset', label: 'Confirmed Same Asset' },
            { id: 'different_asset', label: 'Different Asset' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={filterStatus === f.id ? 'pill-active bg-purple-600 text-white shadow-glass-purple' : 'pill-inactive'}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Content */}
      {loading ? (
        <div className="card py-16 text-center">
          <LoadingSpinner />
          <p className="text-xs text-slate-500 mt-2">Loading semantic complaint matches from MongoDB...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="card text-center py-12 text-slate-500 text-xs">
          No semantic matches found matching your search filter.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing <strong>{filteredMatches.length}</strong> candidate complaint match pairs from MongoDB</span>
            <span>Multilingual BERT model: <code className="font-mono text-slate-700">sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2</code></span>
          </div>

          <div className="space-y-4">
            {filteredMatches.map(m => {
              const currentDecision = reviewStatusMap[m.match_id] || m.review_decision || 'unreviewed'
              const isSameAsset = currentDecision === 'same_asset' || currentDecision === 'confirmed'
              const isDifferentAsset = currentDecision === 'different_asset' || currentDecision === 'rejected'
              const isRelated = currentDecision === 'related_issue'
              const similarityPct = Math.round(m.text_similarity * 100)

              return (
                <div
                  key={m.match_id}
                  className={`card space-y-3 border transition-all ${
                    isSameAsset ? 'border-green-300 bg-green-50/10' : 'border-civic-border'
                  }`}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-civic-border pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-navy-900">{m.match_id}</span>
                      {m.asset_id && (
                        <Link
                          to={`/dashboard/assets/${m.asset_id}`}
                          className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-teal-800 hover:underline font-semibold"
                        >
                          Asset: {m.asset_id}
                        </Link>
                      )}
                      {m.ward && (
                        <span className="text-xs text-slate-500">
                          <MapPin className="inline h-3 w-3 mr-0.5 text-slate-400" />
                          {m.ward}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                        Text Similarity: {similarityPct}%
                      </span>
                      {m.spatial_distance_m !== null && (
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Gap: {m.spatial_distance_m}m
                        </span>
                      )}
                      {m.date_gap_days !== null && (
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {m.date_gap_days}d apart
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Complaint Pair Side-by-Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Complaint A */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-navy-900 flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-teal-600" /> {m.complaint_a_id}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          Earlier Grievance
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {m.complaint_a_text || 'Road defect / asphalt deterioration reported by citizen.'}
                      </p>
                    </div>

                    {/* Complaint B */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-navy-900 flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-teal-600" /> {m.complaint_b_id}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          Subsequent Grievance
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {m.complaint_b_text || 'Recurrent defect report on corridor requiring engineering inspection.'}
                      </p>
                    </div>
                  </div>

                  {/* Evidence explanation & Municipal Review Decision Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p className="font-medium text-slate-800">
                        {m.evidence_explanation || `Semantic similarity ${similarityPct}% between reports within corridor bounds.`}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Category compatibility: {m.category_compatibility} • Candidate type: {m.candidate_type}
                      </p>
                    </div>

                    {/* Review Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isSameAsset ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Confirmed Same Asset
                          </span>
                          <button
                            onClick={() => handleReviewDecision(m.match_id, 'unreviewed' as ReviewDecision)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                          >
                            Undo
                          </button>
                        </div>
                      ) : isDifferentAsset ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-300 shadow-sm">
                            <X className="h-4 w-4 text-rose-600" /> Marked Different Asset
                          </span>
                          <button
                            onClick={() => handleReviewDecision(m.match_id, 'unreviewed' as ReviewDecision)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                          >
                            Undo
                          </button>
                        </div>
                      ) : isRelated ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-purple-800 flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                            <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Related Candidate
                          </span>
                          <button
                            onClick={() => handleReviewDecision(m.match_id, 'unreviewed' as ReviewDecision)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                          >
                            Undo
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewDecision(m.match_id, 'same_asset')}
                            className="btn-emerald text-xs !py-1.5 flex items-center gap-1.5"
                            title="Confirm both reports concern the same physical infrastructure asset"
                          >
                            <Check className="h-3.5 w-3.5" /> Confirm Same Asset
                          </button>
                          <button
                            onClick={() => handleReviewDecision(m.match_id, 'related_issue')}
                            className="btn-secondary text-xs !py-1.5 text-purple-700 border-purple-200 hover:bg-purple-50"
                          >
                            Related
                          </button>
                          <button
                            onClick={() => handleReviewDecision(m.match_id, 'different_asset')}
                            className="btn-rose text-xs !py-1.5 flex items-center gap-1.5"
                            title="Confirm reports concern distinct assets"
                          >
                            <X className="h-3.5 w-3.5" /> Different Asset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
