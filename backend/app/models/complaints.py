from pydantic import BaseModel, Field, field_serializer
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum
from app.models.common import Verification, Source, GeoPoint, VerificationStatus

class AssetLinkStatus(str, Enum):
    unresolved = "unresolved"
    candidate = "candidate"
    confirmed = "confirmed"
    rejected = "rejected"

class Language(BaseModel):
    code: str = "en"
    confidence: float = 1.0
    detector: str = "rule_based"

class Translation(BaseModel):
    text: Optional[str] = None
    target_language: Optional[str] = None
    method: Optional[str] = None
    review_status: str = "not_translated"

class Complaint(BaseModel):
    complaint_id: str
    source_record_id: Optional[str] = None
    description_original: str
    description_analysis: Optional[str] = None
    language: Language = Field(default_factory=Language)
    translation: Translation = Field(default_factory=Translation)
    category: str = "road"
    subcategory: Optional[str] = None
    status: str = "open" # open, in_progress, closed, unknown
    reported_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    location: Optional[GeoPoint] = None
    location_accuracy: str = "unknown" # exact, approximate, ward_only, unknown
    ward: Optional[str] = None
    candidate_asset_ids: List[str] = Field(default_factory=list)
    asset_id: Optional[str] = None
    asset_name: Optional[str] = None
    asset_link_status: AssetLinkStatus = AssetLinkStatus.unresolved
    is_recurring: Optional[bool] = False
    recurrence_count: Optional[int] = 0
    cluster_id: Optional[str] = None
    related_complaint_ids: List[str] = Field(default_factory=list)
    same_problem_evidence: Optional[Dict[str, Any]] = None
    attachments: List[str] = Field(default_factory=list)
    source: Source = Field(default_factory=Source)
    verification: Verification = Field(default_factory=Verification)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @field_serializer('reported_at', 'created_at', mode='plain', check_fields=False)
    def serialize_dt(self, dt: Optional[datetime], _info):
        if dt is None:
            return None
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()

class ComplaintCreate(BaseModel):
    description_original: str
    category: str
    ward: Optional[str] = None
    location: Optional[Dict[str, float]] = None # {"longitude": ..., "latitude": ...}
    consent: bool = True
    reported_at: Optional[datetime] = None
