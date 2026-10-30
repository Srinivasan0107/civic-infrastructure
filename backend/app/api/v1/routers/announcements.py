from fastapi import APIRouter, Query
from app.models.overview import Announcement
from app.models.common import PagedResponse, DataStatus
from datetime import datetime

router = APIRouter(tags=["Announcements"])

@router.get("/announcements", response_model=PagedResponse[Announcement])
async def list_announcements(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1)):
    items = [
        Announcement(
            id="ANN-2025-01",
            title="Monsoon Road Repair Drive Initiated across East Zone",
            content="Bruhat Bengaluru Mahanagara Palike has commenced rapid asphalt cold-mix patching for high-traffic corridors and arterial roads.",
            type="alert",
            published_at="2025-05-20T10:00:00Z"
        ),
        Announcement(
            id="ANN-2025-02",
            title="Ward 150 Drainage De-silting Progress Update",
            content="Stormwater drain de-silting along Outer Ring Road reached 88% completion ahead of scheduled rainfall.",
            type="update",
            published_at="2025-05-18T14:30:00Z"
        ),
        Announcement(
            id="ANN-2025-03",
            title="Streetlight LED Transition Program Schedule",
            content="Inspection teams will be surveying streetlights across Mahadevapura zone from 25th May to 30th May.",
            type="notice",
            published_at="2025-05-15T09:00:00Z"
        )
    ]
    return PagedResponse[Announcement](
        data_status=DataStatus.live,
        last_updated=datetime.utcnow().isoformat(),
        source_count=len(items),
        coverage_notes=["Public municipal notices"],
        items=items,
        total=len(items),
        page=page,
        page_size=page_size
    )
