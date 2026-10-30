from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.models.semantic import (
    SemanticSearchRequest, SemanticSearchResponse, SemanticMatch, ReviewRequest,
    AssetRecurringResponse
)
from app.models.common import PagedResponse, DataStatus
from app.services.semantic_service import semantic_service
from app.repositories.semantic import SemanticRepository

router = APIRouter(prefix="/semantic", tags=["Semantic Analysis"])
repo = SemanticRepository()

@router.post("/search", response_model=SemanticSearchResponse)
async def search_similar_complaints(req: SemanticSearchRequest):
    filters_dict = req.filters.dict() if req.filters else {}
    analysis = await semantic_service.search(
        query=req.query,
        language=req.language,
        filters=filters_dict,
        top_k=req.top_k
    )
    return SemanticSearchResponse(
        data_status=DataStatus.live if analysis["items"] else DataStatus.demo,
        query=req.query,
        language=req.language,
        items=analysis["items"],
        total=analysis["total"],
        matched_asset=analysis.get("matched_asset"),
        detected_language=analysis.get("detected_language"),
        is_recurring=analysis.get("is_recurring", False),
        recurrence_count=analysis.get("recurrence_count", 0),
        recurrence_interval_days=analysis.get("recurrence_interval_days"),
        cluster_id=analysis.get("cluster_id"),
        cluster_title=analysis.get("cluster_title")
    )

@router.get("/assets-clusters", response_model=AssetRecurringResponse)
async def get_assets_recurring_clusters():
    """Return physical assets structured with their recurring complaints and clusters."""
    summaries = await semantic_service.get_assets_recurring_summary()
    return AssetRecurringResponse(
        data_status=DataStatus.live if summaries else DataStatus.demo,
        total=len(summaries),
        items=summaries
    )

@router.get("/matches", response_model=PagedResponse[SemanticMatch])
async def list_matches(
    review_status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    items, total = await repo.list_matches(review_status, page, page_size)
    return PagedResponse[SemanticMatch](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.post("/matches/{match_id}/review")
async def review_match(match_id: str, body: ReviewRequest):
    success = await repo.review_match(match_id, body.decision.value, body.reason, body.reviewer or "admin")
    return {"success": success, "match_id": match_id, "decision": body.decision.value}
