// ============================================================
// Civic Infrastructure Memory — Shared API Types
// Based on .agents/contracts/api-contract.md and data-model.md
// ============================================================

// ---- Shared response wrappers ----

export type DataStatus = 'live' | 'partial' | 'demo' | 'unavailable'

export interface ApiResponse<T> {
  data_status: DataStatus
  last_updated: string | null
  source_count: number
  coverage_notes: string[]
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface SingleResponse<T> {
  data_status: DataStatus
  last_updated: string | null
  data: T
}

// ---- Verification / Source ----

export type VerificationStatus = 'verified' | 'unverified' | 'inferred' | 'approximate' | 'synthetic_demo'

export interface Verification {
  status: VerificationStatus
  method: string | null
  reviewed_by: string | null
  reviewed_at: string | null
}

export interface Source {
  name: string
  url: string | null
  file_id: string | null
  job_id: string | null
  record_id: string | null
  retrieved_at: string | null
  license_url: string | null
  coverage: string | null
}

// ---- Assets ----

export type AssetType = 'road_segment' | 'road_defect' | 'drain' | 'streetlight' | 'footpath' | 'public_toilet' | 'other'

export interface GeoPoint {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export interface GeoLineString {
  type: 'LineString'
  coordinates: Array<[number, number]>
}

export type Geometry = GeoPoint | GeoLineString

export interface SourceId {
  source: string
  id: string
  type: string
}

export interface Asset {
  asset_id: string
  asset_type: AssetType
  name: string | null
  geometry: Geometry | null
  location_text: string | null
  ward: string | null
  zone: string | null
  criticality: { value: string | null; source: string | null }
  source_ids: SourceId[]
  attributes: Record<string, unknown>
  verification: Verification
  source: Source
  created_at: string
  updated_at: string
  // Enriched fields
  latest_risk_score?: number | null
  latest_risk_tier?: string | null
  complaint_count?: number
  open_complaint_count?: number
}

// ---- Timeline Events ----

export type TimelineEventType = 'complaint' | 'inspection' | 'maintenance_action' | 'attachment'

export interface TimelineEvent {
  event_type: TimelineEventType
  event_date: string
  entity_id: string
  summary: string
  source: string
  verification_status: VerificationStatus
  details: Record<string, unknown>
  outcome?: string | null
}

// ---- Complaints ----

export interface Language {
  code: string
  confidence: number
  detector: string
}

export interface Translation {
  text: string | null
  target_language: string | null
  method: string | null
  review_status: 'not_translated' | 'machine_translated' | 'human_reviewed'
}

export interface Embedding {
  model: string
  revision: string | null
  created_at: string
  // vector is NOT returned to frontend
}

export type AssetLinkStatus = 'unresolved' | 'candidate' | 'confirmed' | 'rejected'

export interface Complaint {
  complaint_id: string
  source_record_id: string | null
  description_original: string
  language: Language
  translation: Translation
  category: string
  subcategory: string | null
  status: 'open' | 'in_progress' | 'closed' | 'unknown'
  reported_at: string | null
  closed_at: string | null
  location: GeoPoint | null
  location_accuracy: 'exact' | 'approximate' | 'ward_only' | 'unknown'
  ward: string | null
  candidate_asset_ids: string[]
  asset_id: string | null
  asset_name?: string | null
  asset_link_status: AssetLinkStatus
  is_recurring?: boolean
  recurrence_count?: number
  cluster_id?: string | null
  related_complaint_ids?: string[]
  same_problem_evidence?: {
    top_match_id: string
    top_match_text: string
    similarity_score: number
    similarity_percent: number
    distance_m: number
    date_gap_days: number
    bert_model: string
    recurrence_explanation: string
  } | null
  attachments: string[]
  source: Source
  verification: Verification
  created_at: string
}

// ---- Semantic Search ----

export interface SemanticSearchRequest {
  query: string
  language: string
  filters: {
    ward?: string | null
    asset_type?: string | null
    from?: string | null
    to?: string | null
    radius_m?: number | null
  }
  top_k: number
}

export interface SemanticCandidate {
  complaint_id: string
  description_original: string
  description_translation: string | null
  language: Language
  text_similarity: number
  spatial_distance_m: number | null
  date_gap_days: number | null
  category_compatibility: 'compatible' | 'related' | 'unrelated' | 'unknown'
  source_asset_id_match: boolean | null
  composite_rank: number
  candidate_type: 'same_asset_candidate' | 'related_issue_candidate' | 'insufficient_evidence'
  evidence_explanation: string
  asset_link_status: AssetLinkStatus
  asset_id: string | null
  reported_at: string | null
  ward: string | null
}

export interface SemanticSearchResponse {
  data_status: DataStatus
  query: string
  language: string
  model_version: string
  items: SemanticCandidate[]
  total: number
  matched_asset?: {
    asset_id: string
    name: string
    asset_type: string
    ward: string
    zone?: string
    confidence?: number
  } | null
  detected_language?: {
    code: string
    name: string
    confidence: number
    detector: string
  } | null
  is_recurring?: boolean
  recurrence_count?: number
  recurrence_interval_days?: number | null
  cluster_id?: string | null
  cluster_title?: string | null
}

export interface AssetRecurringSummary {
  asset_id: string
  name: string
  asset_type: string
  ward: string
  zone?: string
  total_complaints: number
  recurring_complaints_count: number
  recurrence_interval_days?: number | null
  cluster_id?: string | null
  cluster_title?: string | null
  risk_tier: string
  risk_score: number
  recent_complaints: {
    complaint_id: string
    description_original: string
    language: string
    status: string
    category: string
    reported_at: string
  }[]
}

export interface AssetRecurringResponse {
  data_status: DataStatus
  total: number
  items: AssetRecurringSummary[]
}

export type ReviewDecision = 'same_asset' | 'related_issue' | 'different_asset' | 'defer'

export interface SemanticMatch {
  match_id: string
  complaint_a_id: string
  complaint_b_id: string
  complaint_a_text?: string | null
  complaint_b_text?: string | null
  asset_id?: string | null
  ward?: string | null
  evidence_explanation?: string | null
  text_similarity: number
  spatial_distance_m: number | null
  date_gap_days: number | null
  category_compatibility: string
  source_asset_id_match: boolean | null
  composite_rank: number
  candidate_type: string
  model_version: string
  review_decision: ReviewDecision | 'unreviewed'
  review_reason: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

// ---- Incident Clusters ----

export interface ClusterReviewHistory {
  decision: string
  reason: string
  reviewer: string
  reviewed_at: string
}

export interface IncidentCluster {
  cluster_id: string
  title?: string
  ward?: string
  incident_category?: string
  cluster_size?: number
  time_span_days?: number
  primary_asset_id?: string
  member_complaint_ids: string[]
  candidate_asset_ids: string[]
  time_start: string | null
  time_end: string | null
  centroid: GeoPoint | null
  algorithm: string
  parameters: Record<string, unknown>
  model_version: string
  review_status: 'unreviewed' | 'confirmed' | 'split' | 'merged' | 'rejected'
  review_history: ClusterReviewHistory[]
  // Computed
  member_count: number
  affected_assets_count: number
  recurrence_interval_days: number | null
  open_count: number
  closed_count: number
  created_at: string
  updated_at: string
  source_file_name?: string
  source?: string
  checksum_sha256?: string
  records_ingested?: number
  records_rejected?: number
}

// ---- Prioritization ----

export type PriorityTier = 'critical' | 'high' | 'medium' | 'low'

export interface ScoreComponent {
  name: string
  value: number
  weight: number
  contribution: number
  evidence_ids: string[]
  notes: string | null
}

export interface AssetRiskSnapshot {
  snapshot_id: string
  asset_id: string
  score: number
  tier: PriorityTier
  score_type: 'priority_score' // never 'failure_probability'
  components: ScoreComponent[]
  data_sufficiency: 'sufficient' | 'partial' | 'insufficient'
  data_sufficiency_notes: string[]
  method_version: string
  model_version: string | null
  generated_at: string
  evidence_complaint_ids: string[]
  calculated_at?: string
  method?: string
}

// ---- Ingestion ----

export type JobStatus = 'queued' | 'running' | 'partial' | 'completed' | 'failed' | 'cancelled'

export interface JobCounters {
  raw_records: number
  normalized: number
  rejected: number
  assets_created: number
  assets_linked: number
  complaints_created: number
  duplicates_skipped: number
  embeddings_generated: number
}

export interface IngestionJob {
  job_id: string
  source_name: string
  source_file_id: string
  file_sha256: string
  status: JobStatus
  pipeline_version: string
  mapping_version: string | null
  stage: string
  started_at: string
  completed_at: string | null
  counters: JobCounters
  checkpoint: Record<string, unknown>
  error_summary: string | null
  created_at: string
  updated_at: string
  source_file_name?: string
  source?: string
  checksum_sha256?: string
  records_ingested?: number
  records_rejected?: number
}

export interface RejectedRecord {
  id: string
  raw_record_id: string
  job_id: string
  stage: string
  errors: Array<{ field: string; code: string; message: string }>
  created_at: string
}

// ---- Media / Attachments ----

export type ProcessingStatus = 'queued' | 'running' | 'completed' | 'partial' | 'failed'

export interface AttachmentLink {
  entity_type: 'complaint' | 'asset' | 'inspection' | 'maintenance_action'
  entity_id: string
  relation: 'reported_with' | 'inspected' | 'before_repair' | 'after_repair'
  link_method: 'source_id' | 'manual_review' | 'model_candidate'
}

export interface Attachment {
  attachment_id: string
  gridfs_id: string
  parent_attachment_id: string | null
  kind: 'original' | 'thumbnail' | 'defect_crop'
  sha256: string
  perceptual_hash: string | null
  mime_type: string
  width: number | null
  height: number | null
  captured_at: string | null
  uploaded_at: string
  location: GeoPoint | null
  location_accuracy: 'exact' | 'approximate' | 'unknown'
  links: AttachmentLink[]
  source: Source
  verification: Verification
  processing_status: ProcessingStatus
}

export interface ImageDetection {
  detection_id: string
  attachment_id: string
  detector_name: string
  detector_version: string
  class_id: string
  class_label: string
  confidence: number
  bbox_xyxy_normalized: [number, number, number, number]
  crop_attachment_id: string | null
  severity_proxy: string | null
  inference_at: string
  verification_status: VerificationStatus
}

export interface AttachmentAnalysis {
  attachment_id: string
  processing_status: ProcessingStatus
  detections: ImageDetection[]
  full_image_embedding_id: string | null
  crop_embedding_ids: string[]
  model_versions: Record<string, string>
  error_summary: string | null
}

// ---- Visual Matches ----

export type VisualReviewDecision =
  | 'same_asset_recurrence'
  | 'related_damage'
  | 'different_location_or_asset'
  | 'not_comparable'
  | 'defer'
  | 'unreviewed'

export interface VisualMatch {
  visual_match_id: string
  attachment_a_id: string
  attachment_b_id: string
  asset_a_id: string | null
  asset_b_id: string | null
  image_similarity: number
  defect_class_agreement: boolean | null
  spatial_distance_m: number | null
  date_gap_days: number | null
  asset_id_match: boolean | null
  source_link_match: boolean | null
  composite_rank: number
  candidate_type: 'visual_recurrence_candidate' | 'related_damage_candidate' | 'duplicate_upload' | 'insufficient_evidence'
  evidence_summary?: string | null
  model_version: string
  preprocessing_version: string
  review_decision: VisualReviewDecision
  review_reason: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  review_history: Array<{ decision: VisualReviewDecision; reason: string; reviewer: string; reviewed_at: string }>
  created_at: string
}

// ---- Data Quality ----

export interface DataQualityReport {
  data_status: DataStatus
  last_updated: string | null
  total_raw_records: number
  total_normalized_records: number
  total_rejected_records: number
  missing_coordinates: number
  unresolved_asset_links: number
  unknown_dates: number
  duplicate_source_records: number
  media_coverage: { total: number; processed: number; failed: number; missing_geotags: number }
  embedding_coverage: { total: number; embedded: number; model: string }
  source_license_gaps: number
  repair_outcome_coverage: { total: number; with_outcome: number }
}

// ---- Overview KPIs ----

export interface KpiValue {
  value: number | null
  unit: string
  comparison_period: string | null
  comparison_delta: number | null
  source_note: string
  coverage_note: string | null
}

export interface OverviewResponse {
  data_status: DataStatus
  last_updated: string | null
  coverage_notes: string[]
  kpis: {
    total_assets: KpiValue
    total_complaints: KpiValue
    open_complaints: KpiValue
    confirmed_recurring_incidents: KpiValue
    high_priority_assets: KpiValue
    overdue_work_orders: KpiValue
    data_quality_score: KpiValue
  }
  recent_trends: Array<{ date: string; complaints: number; resolved: number }>
  category_distribution: Array<{ category: string; count: number }>
  ward_summary: Array<{ ward: string; complaints: number; high_priority: number }>
}

// ---- Announcements ----

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'notice' | 'update' | 'alert' | 'info'
  published_at: string
  expires_at: string | null
  data_status: DataStatus
}
