from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum
from app.models.common import Verification, Source, GeoPoint, GeoLineString, VerificationStatus

class AssetType(str, Enum):
    road_segment = "road_segment"
    road_defect = "road_defect"
    drain = "drain"
    streetlight = "streetlight"
    footpath = "footpath"
    public_toilet = "public_toilet"
    other = "other"

class SourceId(BaseModel):
    source: str
    id: str
    type: str

class Asset(BaseModel):
    asset_id: str
    asset_type: AssetType
    name: Optional[str] = None
    geometry: Optional[Union[GeoPoint, GeoLineString]] = None
    location_text: Optional[str] = None
    ward: Optional[str] = None
    zone: Optional[str] = None
    criticality: Dict[str, Optional[str]] = Field(default_factory=lambda: {"value": None, "source": None})
    source_ids: List[SourceId] = Field(default_factory=list)
    attributes: Dict[str, Any] = Field(default_factory=dict)
    verification: Verification = Field(default_factory=Verification)
    source: Source = Field(default_factory=Source)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    # Computed / enriched
    latest_risk_score: Optional[float] = None
    latest_risk_tier: Optional[str] = None
    complaint_count: int = 0
    open_complaint_count: int = 0

class TimelineEvent(BaseModel):
    event_type: str # complaint, inspection, maintenance_action, attachment
    event_date: str
    entity_id: str
    summary: str
    source: str
    verification_status: VerificationStatus
    details: Dict[str, Any] = Field(default_factory=dict)
