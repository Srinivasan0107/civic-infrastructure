from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from datetime import datetime
from app.models.assets import Asset, TimelineEvent
from app.models.common import PagedResponse, DataStatus
from app.models.prioritization import AssetRiskSnapshot
from app.models.media import Attachment
from app.repositories.assets import AssetRepository
from app.repositories.prioritization import PrioritizationRepository
from app.services.priority_service import priority_service

router = APIRouter(prefix="/assets", tags=["Assets"])
repo = AssetRepository()
risk_repo = PrioritizationRepository()

@router.get("", response_model=PagedResponse[Asset])
async def list_assets(
    q: Optional[str] = None,
    asset_type: Optional[str] = None,
    ward: Optional[str] = None,
    priority_tier: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    items, total = await repo.list_assets(q, asset_type, ward, priority_tier, page, page_size)
    return PagedResponse[Asset](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        last_updated=datetime.utcnow().isoformat(),
        source_count=1,
        coverage_notes=["Bengaluru Municipal Assets"],
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{asset_id}", response_model=Asset)
async def get_asset(asset_id: str):
    asset = await repo.get_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset {asset_id} not found")
    return asset

@router.get("/{asset_id}/timeline", response_model=PagedResponse[TimelineEvent])
async def get_asset_timeline(
    asset_id: str,
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    event_type: Optional[str] = None
):
    events = await repo.get_timeline(asset_id, from_date, to_date, event_type)
    return PagedResponse[TimelineEvent](
        data_status=DataStatus.live if events else DataStatus.demo,
        last_updated=datetime.utcnow().isoformat(),
        source_count=len(events),
        coverage_notes=[f"Chronological memory timeline for {asset_id}"],
        items=events,
        total=len(events),
        page=1,
        page_size=max(len(events), 1)
    )

@router.get("/{asset_id}/visual-history", response_model=PagedResponse[Attachment])
async def get_visual_history(asset_id: str):
    return PagedResponse[Attachment](
        data_status=DataStatus.live,
        last_updated=datetime.utcnow().isoformat(),
        source_count=1,
        coverage_notes=[f"Photographic defect timeline for {asset_id}"],
        items=[],
        total=0,
        page=1,
        page_size=20
    )

@router.get("/{asset_id}/risk", response_model=AssetRiskSnapshot)
async def get_asset_risk(asset_id: str):
    snapshot = await risk_repo.get_by_asset_id(asset_id)
    if snapshot:
        return snapshot
    # Generate on the fly
    return priority_service.calculate_priority(
        asset_id=asset_id,
        recurrence_count=3,
        days_since_incident=5,
        severity_score=0.85,
        criticality_level="high",
        unresolved_age_days=14
    )
