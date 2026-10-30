from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime
from app.models.prioritization import AssetRiskSnapshot
from app.models.common import PagedResponse, DataStatus
from app.repositories.prioritization import PrioritizationRepository

router = APIRouter(prefix="/prioritization", tags=["Predictive Prioritization"])
repo = PrioritizationRepository()

@router.get("", response_model=PagedResponse[AssetRiskSnapshot])
async def list_prioritization(
    ward: Optional[str] = None,
    asset_type: Optional[str] = None,
    tier: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    items, total = await repo.list_snapshots(ward, asset_type, tier, page, page_size)
    return PagedResponse[AssetRiskSnapshot](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        last_updated=datetime.utcnow().isoformat(),
        source_count=total,
        coverage_notes=["Rule-based explainable asset prioritization scores (0-100)"],
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )
