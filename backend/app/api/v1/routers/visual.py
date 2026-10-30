from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.models.media import VisualMatch, VisualReviewRequest
from app.models.common import PagedResponse, DataStatus
from app.repositories.media import MediaRepository

router = APIRouter(prefix="/visual", tags=["Visual Matches"])
repo = MediaRepository()

@router.get("/matches", response_model=PagedResponse[VisualMatch])
async def list_visual_matches(
    asset_id: Optional[str] = None,
    review_status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    items, total = await repo.list_visual_matches(asset_id, review_status, page, page_size)
    return PagedResponse[VisualMatch](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.post("/matches/{match_id}/review")
async def review_visual_match(match_id: str, body: VisualReviewRequest):
    success = await repo.review_visual_match(match_id, body.decision, body.reason, body.reviewer or "admin")
    return {"success": success, "visual_match_id": match_id, "decision": body.decision}
