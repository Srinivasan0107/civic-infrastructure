import { useTranslation } from 'react-i18next'
import { Shield, Brain, Layers, Cpu } from 'lucide-react'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">{t('about.title')}</h1>
        <p className="text-slate-600 leading-relaxed">{t('about.p1')}</p>
        <p className="text-slate-600 leading-relaxed">{t('about.p2')}</p>
        <p className="text-slate-600 leading-relaxed">{t('about.p3')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-navy-800 font-semibold">
            <Brain className="h-5 w-5 text-teal-600" /> Multilingual E5 Embeddings
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Preserves original citizen complaints in Kannada, Hindi, Tamil, Telugu, and English. Queries use <code>query: </code> prefix and passages use <code>passage: </code> prefix for zero-shot cross-lingual retrieval.
          </p>
        </div>
        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-navy-800 font-semibold">
            <Cpu className="h-5 w-5 text-navy-700" /> YOLO + DINOv2 Visual Intelligence
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            RDD2022 road defect detection taxonomy coupled with DINOv2 visual embeddings enables historical side-by-side photo comparison and visual recurrence tracking without automatic destructive merges.
          </p>
        </div>
        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-navy-800 font-semibold">
            <Layers className="h-5 w-5 text-amber-600" /> Explainable Prioritization (0–100)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rule-based transparent scoring weighing recurrence frequency, days since incident, damage severity, and asset criticality. Never presented as uncalibrated failure probabilities.
          </p>
        </div>
        <div className="card space-y-3">
          <div className="flex items-center gap-2 text-navy-800 font-semibold">
            <Shield className="h-5 w-5 text-green-600" /> Local-First MongoDB & GridFS
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fully self-contained on local MongoDB 8.x with GridFS chunked media storage. No external SaaS subscriptions or proprietary cloud dependencies required.
          </p>
        </div>
      </div>
    </div>
  )
}
