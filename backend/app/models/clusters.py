from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.common import GeoPoint

class ClusterReviewHistory(BaseModel):
    decision: str
    reason: Optional[str] = None
    reviewer: str
    reviewed_at: datetime = Field(default_factory=datetime.utcnow)

class IncidentCluster(BaseModel):
    cluster_id: str
    member_complaint_ids: List[str] = Field(default_factory=list)
    candidate_asset_ids: List[str] = Field(default_factory=list)
    time_start: Optional[datetime] = None
    time_end: Optional[datetime] = None
    centroid: Optional[GeoPoint] = None
    algorithm: str = "HDBSCAN_spatial_temporal"
    parameters: Dict[str, Any] = Field(default_factory=dict)
    model_version: str = "1.0.0"
    review_status: str = "unreviewed" # unreviewed, confirmed, split, merged, rejected
    review_history: List[ClusterReviewHistory] = Field(default_factory=list)
    member_count: int = 0
    affected_assets_count: int = 0
    recurrence_interval_days: Optional[float] = None
    open_count: int = 0
    closed_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ClusterReviewRequest(BaseModel):
    decision: str # confirm, split, merge, reject
    reason: Optional[str] = None
    reviewer: Optional[str] = "admin"
