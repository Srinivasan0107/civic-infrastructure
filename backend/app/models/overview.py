from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.models.common import DataStatus

class KpiValue(BaseModel):
    value: Optional[float] = None
    unit: str = "count"
    comparison_period: Optional[str] = None
    comparison_delta: Optional[float] = None
    source_note: str = "BBMP System"
    coverage_note: Optional[str] = None

class OverviewKpis(BaseModel):
    total_assets: KpiValue
    total_complaints: KpiValue
    open_complaints: KpiValue
    confirmed_recurring_incidents: KpiValue
    high_priority_assets: KpiValue
    overdue_work_orders: KpiValue
    data_quality_score: KpiValue

class OverviewResponse(BaseModel):
    data_status: DataStatus = DataStatus.live
    last_updated: Optional[str] = None
    coverage_notes: List[str] = Field(default_factory=list)
    kpis: OverviewKpis
    recent_trends: List[Dict[str, Any]] = Field(default_factory=list)
    category_distribution: List[Dict[str, Any]] = Field(default_factory=list)
    ward_summary: List[Dict[str, Any]] = Field(default_factory=list)

class DataQualityReport(BaseModel):
    data_status: DataStatus = DataStatus.live
    last_updated: Optional[str] = None
    total_raw_records: int = 0
    total_normalized_records: int = 0
    total_rejected_records: int = 0
    missing_coordinates: int = 0
    unresolved_asset_links: int = 0
    unknown_dates: int = 0
    duplicate_source_records: int = 0
    media_coverage: Dict[str, Any] = Field(default_factory=lambda: {"total": 0, "processed": 0, "failed": 0, "missing_geotags": 0})
    embedding_coverage: Dict[str, Any] = Field(default_factory=lambda: {"total": 0, "embedded": 0, "model": "intfloat/multilingual-e5-base"})
    source_license_gaps: int = 0
    repair_outcome_coverage: Dict[str, Any] = Field(default_factory=lambda: {"total": 0, "with_outcome": 0})

class Announcement(BaseModel):
    id: str
    title: str
    content: str
    type: str = "notice" # notice, update, alert, info
    published_at: str
    expires_at: Optional[str] = None
    data_status: DataStatus = DataStatus.live
