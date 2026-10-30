import apiClient from './client'
import type {
  ApiResponse,
  OverviewResponse,
  Asset,
  TimelineEvent,
  AssetRiskSnapshot,
  Complaint,
  SemanticSearchRequest,
  SemanticSearchResponse,
  AssetRecurringResponse,
  SemanticMatch,
  ReviewDecision,
  IncidentCluster,
  AssetRiskSnapshot as PrioritizationItem,
  IngestionJob,
  RejectedRecord,
  Attachment,
  AttachmentAnalysis,
  VisualMatch,
  VisualReviewDecision,
  DataQualityReport,
  Announcement,
} from './types'

// ---- Health ----
export const healthApi = {
  check: () => apiClient.get<{ status: string; mongodb: string; services: Record<string, string> }>('/health'),
}

// ---- Overview ----
export const overviewApi = {
  get: (params?: { from?: string; to?: string; ward?: string; asset_type?: string }) =>
    apiClient.get<OverviewResponse>('/overview', { params }),
}

// ---- Assets ----
export const assetsApi = {
  list: (params?: { q?: string; asset_type?: string; ward?: string; priority_tier?: string; page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<Asset>>('/assets', { params }),

  get: (assetId: string) =>
    apiClient.get<Asset>(`/assets/${assetId}`),

  getTimeline: (assetId: string, params?: { from?: string; to?: string; event_type?: string }) =>
    apiClient.get<ApiResponse<TimelineEvent>>(`/assets/${assetId}/timeline`, { params }),

  getVisualHistory: (assetId: string, params?: { from?: string; to?: string }) =>
    apiClient.get<ApiResponse<Attachment>>(`/assets/${assetId}/visual-history`, { params }),

  getRisk: (assetId: string) =>
    apiClient.get<AssetRiskSnapshot>(`/assets/${assetId}/risk`),
}

// ---- Complaints ----
export const complaintsApi = {
  list: (params?: { ward?: string; category?: string; status?: string; page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<Complaint>>('/complaints', { params }),

  get: (complaintId: string) =>
    apiClient.get<Complaint>(`/complaints/${complaintId}`),

  create: (data: {
    description_original: string
    category: string
    ward?: string
    location?: { longitude: number; latitude: number }
    consent: boolean
    reported_at?: string
  }) => apiClient.post<Complaint>('/complaints', data),
}

// ---- Semantic ----
export const semanticApi = {
  search: (request: SemanticSearchRequest) =>
    apiClient.post<SemanticSearchResponse>('/semantic/search', request),

  getAssetsClusters: () =>
    apiClient.get<AssetRecurringResponse>('/semantic/assets-clusters'),

  listMatches: (params?: { review_status?: string; page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<SemanticMatch>>('/semantic/matches', { params }),

  reviewMatch: (matchId: string, decision: ReviewDecision, reason?: string) =>
    apiClient.post(`/semantic/matches/${matchId}/review`, { decision, reason }),
}

// ---- Clusters ----
export const clustersApi = {
  list: (params?: { ward?: string; asset_type?: string; review_status?: string; page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<IncidentCluster>>('/clusters', { params }),

  get: (clusterId: string) =>
    apiClient.get<IncidentCluster>(`/clusters/${clusterId}`),

  review: (clusterId: string, decision: 'confirm' | 'split' | 'merge' | 'reject' | 'confirmed' | 'dismissed', reason?: string) =>
    apiClient.post(`/clusters/${clusterId}/review`, { decision, reason }),
}

// ---- Prioritization ----
export const prioritizationApi = {
  list: (params?: { ward?: string; asset_type?: string; tier?: string; as_of?: string; page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<PrioritizationItem>>('/prioritization', { params }),
}

// ---- Ingestion ----
export const ingestionApi = {
  upload: (
    file: File,
    metadata: { source_name: string; dataset_type: string; mapping_profile?: string; terms_url?: string }
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(metadata).forEach(([k, v]) => { if (v) formData.append(k, v) })
    return apiClient.post<{ job_id: string; status: string }>('/ingestion/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 min for large files
    })
  },

  listJobs: (params?: { page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<IngestionJob>>('/ingestion/jobs', { params }),

  getJob: (jobId: string) =>
    apiClient.get<IngestionJob>(`/ingestion/jobs/${jobId}`),

  retryJob: (jobId: string) =>
    apiClient.post(`/ingestion/jobs/${jobId}/retry`),

  getRejected: (jobId: string, format: 'json' | 'csv' = 'json') =>
    apiClient.get<ApiResponse<RejectedRecord>>(`/ingestion/jobs/${jobId}/rejected`, { params: { format } }),
}

// ---- Media ----
export const mediaApi = {
  upload: (
    file: File,
    metadata: {
      complaint_id?: string
      asset_id?: string
      inspection_id?: string
      maintenance_action_id?: string
      relation: string
    }
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(metadata).forEach(([k, v]) => { if (v) formData.append(k, v) })
    return apiClient.post<{ attachment_id: string; job_id: string }>('/media/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    })
  },

  uploadAttachment: (
    file: File,
    metadata: {
      complaint_id?: string
      asset_id?: string
      inspection_id?: string
      maintenance_action_id?: string
      relation: string
    }
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(metadata).forEach(([k, v]) => { if (v) formData.append(k, v) })
    return apiClient.post<{ attachment_id: string; job_id: string }>('/media/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    })
  },

  listAttachments: (params?: { asset_id?: string; complaint_id?: string; page?: number; page_size?: number }) =>
    apiClient.get<{ items: any[]; total: number }>('/media/attachments', { params }),

  get: (attachmentId: string) =>
    apiClient.get<Attachment>(`/media/attachments/${attachmentId}`),

  getAnalysis: (attachmentId: string) =>
    apiClient.get<AttachmentAnalysis>(`/media/attachments/${attachmentId}/analysis`),

  analyze: (attachmentId: string) =>
    apiClient.post(`/media/attachments/${attachmentId}/analyze`),

  // Stream URL for image display — use as <img src={url}> or background
  getStreamUrl: (attachmentId: string) =>
    `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/media/attachments/${attachmentId}/stream`,
}

// ---- Visual Matches ----
export const visualMatchesApi = {
  list: (params?: { asset_id?: string; review_status?: string; page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<VisualMatch>>('/visual/matches', { params }),

  review: (matchId: string, decision: VisualReviewDecision, reason?: string) =>
    apiClient.post(`/visual/matches/${matchId}/review`, { decision, reason }),
}

// ---- Data Quality ----
export const dataQualityApi = {
  get: () => apiClient.get<DataQualityReport>('/data-quality'),
}

// ---- Announcements (public endpoint) ----
export const announcementsApi = {
  list: (params?: { page?: number; page_size?: number }) =>
    apiClient.get<ApiResponse<Announcement>>('/announcements', { params }),
}

// ---- Reports & Data Export ----
export const reportsApi = {
  getExportUrl: (reportType: string, ward?: string) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api/v1'
    const params = new URLSearchParams({ report_type: reportType, format: 'csv' })
    if (ward) params.append('ward', ward)
    return `${base}/reports/export?${params.toString()}`
  },
  downloadReport: async (reportType: string, filename?: string, ward?: string) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api/v1'
    const params = new URLSearchParams({ report_type: reportType, format: 'csv' })
    if (ward) params.append('ward', ward)
    const response = await fetch(`${base}/reports/export?${params.toString()}`)
    if (!response.ok) throw new Error('Failed to download report')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `${reportType}_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
  downloadRejectedCsv: async (jobId: string) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api/v1'
    const response = await fetch(`${base}/ingestion/jobs/${jobId}/rejected?format=csv`)
    if (!response.ok) throw new Error('Failed to download rejected records')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rejected_records_${jobId}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

