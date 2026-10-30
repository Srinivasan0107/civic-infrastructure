from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime
from app.models.complaints import Complaint, ComplaintCreate
from app.models.common import PagedResponse, DataStatus
from app.repositories.complaints import ComplaintRepository
from app.services.semantic_service import semantic_service

router = APIRouter(prefix="/complaints", tags=["Complaints"])
repo = ComplaintRepository()

@router.get("", response_model=PagedResponse[Complaint])
async def list_complaints(
    ward: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    asset_id: Optional[str] = None,
    geography: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    items, total = await repo.list_complaints(
        ward=ward,
        category=category,
        status=status,
        asset_id=asset_id,
        geography=geography,
        page=page,
        page_size=page_size
    )
    return PagedResponse[Complaint](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        last_updated=datetime.utcnow().isoformat(),
        source_count=total,
        coverage_notes=["BBMP Public Grievances"],
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{complaint_id}", response_model=Complaint)
async def get_complaint(complaint_id: str):
    complaint = await repo.get_by_id(complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail=f"Complaint {complaint_id} not found")
    return complaint

@router.post("", response_model=Complaint)
async def create_complaint(data: ComplaintCreate):
    import uuid
    from datetime import timezone
    now_utc = datetime.now(timezone.utc)
    rep_time = data.reported_at or now_utc
    if rep_time.tzinfo is None:
        rep_time = rep_time.replace(tzinfo=timezone.utc)

    complaint_id = f"BBMP-{now_utc.year}-{str(uuid.uuid4())[:8].upper()}"
    
    # Base complaint document
    new_doc = {
        "complaint_id": complaint_id,
        "description_original": data.description_original,
        "category": data.category,
        "status": "open",
        "reported_at": rep_time,
        "ward": data.ward or "Bellandur",
        "location": {
            "type": "Point",
            "coordinates": [data.location["longitude"], data.location["latitude"]]
        } if data.location else None,
        "verification": {"status": "unverified", "source": "Public Grievance Portal Submission"},
        "created_at": now_utc
    }
    
    # Run dynamic semantic analysis, asset matching, recurrence check and cluster linkage
    enriched_doc = await semantic_service.process_new_complaint(new_doc)
    
    created = await repo.create(enriched_doc)
    return created
