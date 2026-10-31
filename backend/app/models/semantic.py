from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from app.models.common import DataStatus
from app.models.complaints import Language, AssetLinkStatus

class ReviewDecision(str, Enum):
    same_asset = "same_asset"
    related_issue = "related_issue"
    different_asset = "different_asset"
    defer = "defer"

class SemanticSearchFilters(BaseModel):
    ward: Optional[str] = None
    asset_type: Optional[str] = None
    from_date: Optional[str] = Field(None, alias="from")
    to_date: Optional[str] = Field(None, alias="to")
    radius_m: Optional[float] = 500

class SemanticSearchRequest(BaseModel):
    query: str
    language: str = "en"
    filters: Optional[SemanticSearchFilters] = None
    top_k: int = 10

class SemanticCandidate(BaseModel):
    complaint_id: str
    description_original: str
    description_translation: Optional[str] = None
    language: Language
    text_similarity: float
    spatial_distance_m: Optional[float] = None
    date_gap_days: Optional[int] = None
    category_compatibility: str # compatible, related, unrelated, unknown
    source_asset_id_match: Optional[bool] = None
    composite_rank: int
    candidate_type: str # same_asset_candidate, related_issue_candidate, insufficient_evidence
    evidence_explanation: str
    asset_link_status: AssetLinkStatus
    asset_id: Optional[str] = None
    reported_at: Optional[str] = None
    ward: Optional[str] = None

class SemanticSearchResponse(BaseModel):
    data_status: DataStatus = DataStatus.live
    query: str
    language: str
    model_version: str = "intfloat/multilingual-e5-base"
    items: List[SemanticCandidate] = Field(default_factory=list)
    total: int = 0
    matched_asset: Optional[Dict[str, Any]] = None
    detected_language: Optional[Dict[str, Any]] = None
    is_recurring: bool = False
    recurrence_count: int = 0
    recurrence_interval_days: Optional[float] = None
    cluster_id: Optional[str] = None
    cluster_title: Optional[str] = None

class AssetRecurringSummary(BaseModel):
    asset_id: str
    name: str
    asset_type: str
    ward: str
    zone: Optional[str] = None
    total_complaints: int
    recurring_complaints_count: int
    recurrence_interval_days: Optional[float] = None
    cluster_id: Optional[str] = None
    cluster_title: Optional[str] = None
    risk_tier: str
    risk_score: float
    recent_complaints: List[Dict[str, Any]] = Field(default_factory=list)

class AssetRecurringResponse(BaseModel):
    data_status: DataStatus = DataStatus.live
    total: int = 0
    items: List[AssetRecurringSummary] = Field(default_factory=list)

class ReviewRequest(BaseModel):
    decision: ReviewDecision
    reason: Optional[str] = None
    reviewer: Optional[str] = "admin"

class SemanticMatch(BaseModel):
    match_id: str
    complaint_a_id: str
    complaint_b_id: str
    complaint_a_text: Optional[str] = None
    complaint_b_text: Optional[str] = None
    asset_id: Optional[str] = None
    ward: Optional[str] = None
    evidence_explanation: Optional[str] = None
    text_similarity: float
    spatial_distance_m: Optional[float] = None
    date_gap_days: Optional[int] = None
    category_compatibility: str
    source_asset_id_match: Optional[bool] = None
    composite_rank: int
    candidate_type: str
    model_version: str = "intfloat/multilingual-e5-base"
    review_decision: str = "unreviewed"
    review_reason: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
