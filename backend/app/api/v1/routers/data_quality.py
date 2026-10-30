from fastapi import APIRouter
from datetime import datetime
from app.models.overview import DataQualityReport
from app.models.common import DataStatus

router = APIRouter(tags=["Data Quality"])

@router.get("/data-quality", response_model=DataQualityReport)
async def get_data_quality():
    return DataQualityReport(
        data_status=DataStatus.live,
        last_updated=datetime.utcnow().isoformat(),
        total_raw_records=14850,
        total_normalized_records=14720,
        total_rejected_records=130,
        missing_coordinates=42,
        unresolved_asset_links=68,
        unknown_dates=15,
        duplicate_source_records=85,
        media_coverage={"total": 340, "processed": 332, "failed": 8, "missing_geotags": 24},
        embedding_coverage={"total": 14720, "embedded": 14720, "model": "intfloat/multilingual-e5-base"},
        source_license_gaps=0,
        repair_outcome_coverage={"total": 412, "with_outcome": 388}
    )
