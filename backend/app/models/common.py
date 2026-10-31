from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Optional, Any, Union
from enum import Enum
from datetime import datetime

class DataStatus(str, Enum):
    live = "live"
    partial = "partial"
    demo = "demo"
    unavailable = "unavailable"

class VerificationStatus(str, Enum):
    verified = "verified"
    verified_external = "verified_external"
    unverified = "unverified"
    inferred = "inferred"
    approximate = "approximate"
    synthetic_demo = "synthetic_demo"

class Verification(BaseModel):
    status: Union[VerificationStatus, str] = VerificationStatus.unverified
    method: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    source: Optional[str] = None
    staff_name: Optional[str] = None

    class Config:
        extra = "allow"

class Source(BaseModel):
    name: str = "BBMP"
    url: Optional[str] = None
    file_id: Optional[str] = None
    job_id: Optional[str] = None
    record_id: Optional[str] = None
    retrieved_at: Optional[datetime] = None
    license_url: Optional[str] = None
    coverage: Optional[str] = None
    geography: Optional[str] = None
    dataset_role: Optional[str] = None

    class Config:
        extra = "allow"

class GeoPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float] # [longitude, latitude]

class GeoLineString(BaseModel):
    type: str = "LineString"
    coordinates: List[List[float]] # [[lon, lat], [lon, lat]]

T = TypeVar("T")

class PagedResponse(BaseModel, Generic[T]):
    data_status: DataStatus = DataStatus.live
    last_updated: Optional[str] = None
    source_count: int = 0
    coverage_notes: List[str] = Field(default_factory=list)
    items: List[T] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20

class SingleResponse(BaseModel, Generic[T]):
    data_status: DataStatus = DataStatus.live
    last_updated: Optional[str] = None
    data: T
