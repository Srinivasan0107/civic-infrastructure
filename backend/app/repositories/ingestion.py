from app.repositories.base import BaseRepository
from app.core.logging import logger
from typing import Optional, List, Dict, Any
from datetime import datetime

class IngestionRepository(BaseRepository):
    def __init__(self):
        super().__init__("ingestion_jobs")

    def _get_demo_jobs(self) -> List[Dict[str, Any]]:
        return [
            {
                "job_id": "JOB-BBMP-2025-01",
                "source_name": "BBMP Grievance Portal",
                "source_file_id": "GRID-CSV-01",
                "file_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "status": "completed",
                "pipeline_version": "1.0.0",
                "mapping_version": "bbmp_v1",
                "stage": "completed",
                "started_at": datetime.utcnow(),
                "completed_at": datetime.utcnow(),
                "counters": {
                    "raw_records": 3840,
                    "normalized": 3812,
                    "rejected": 28,
                    "assets_created": 340,
                    "assets_linked": 3790,
                    "complaints_created": 3812,
                    "duplicates_skipped": 0,
                    "embeddings_generated": 3812
                },
                "checkpoint": {"last_row": 3840},
                "error_summary": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]

    async def list_jobs(self, page: int = 1, page_size: int = 20) -> tuple[List[Dict[str, Any]], int]:
        col = self.collection
        if col is not None:
            try:
                total = await col.count_documents({})
                if total > 0:
                    cursor = col.find({}).sort("started_at", -1).skip((page - 1) * page_size).limit(page_size)
                    items = await cursor.to_list(length=page_size)
                    for item in items:
                        item.pop("_id", None)
                    return items, total
            except Exception as e:
                logger.warning(f"Error querying ingestion jobs: {e}")

        items = self._get_demo_jobs()
        return items[:page_size], len(items)

    async def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        for j in self._get_demo_jobs():
            if j.get("job_id") == job_id:
                return j
        return None

    async def get_rejected(self, job_id: str, page: int = 1, page_size: int = 50) -> tuple[List[Dict[str, Any]], int]:
        return [
            {
                "rejection_id": "REJ-001",
                "job_id": job_id,
                "source_row_index": 42,
                "raw_record_id": "RAW-0042",
                "stage": "spatial_validation",
                "error_code": "INVALID_COORDINATES",
                "error_message": "Longitude 12.9716 is outside Bangalore bounding box (lat/lon inverted)",
                "raw_data": {"ward": "150", "lat": 77.5946, "lon": 12.9716, "issue": "Pothole"},
                "rejected_at": datetime.utcnow()
            },
            {
                "rejection_id": "REJ-002",
                "job_id": job_id,
                "source_row_index": 118,
                "raw_record_id": "RAW-0118",
                "stage": "schema_normalization",
                "error_code": "MISSING_REQUIRED_DATE",
                "error_message": "Record missing incident registration timestamp",
                "raw_data": {"ward": "174", "lat": 12.9128, "lon": 77.6446, "issue": "Broken streetlight"},
                "rejected_at": datetime.utcnow()
            }
        ], 2
