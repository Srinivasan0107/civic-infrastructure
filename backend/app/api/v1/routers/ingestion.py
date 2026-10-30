from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
import io
import csv
from app.models.ingestion import IngestionJob, RejectedRecord
from app.models.common import PagedResponse, DataStatus
from app.services.ingestion_service import ingestion_service
from app.repositories.ingestion import IngestionRepository

router = APIRouter(prefix="/ingestion", tags=["Dataset Ingestion"])
repo = IngestionRepository()

@router.post("/files")
async def upload_dataset_file(
    file: UploadFile = File(...),
    source_name: str = Form("BBMP"),
    dataset_type: str = Form("grievances_csv"),
    mapping_profile: str = Form("bbmp_v1"),
    terms_url: Optional[str] = Form(None)
):
    content = await file.read()
    job = await ingestion_service.ingest_file(
        file_bytes=content,
        filename=file.filename or "dataset.csv",
        source_name=source_name,
        dataset_type=dataset_type,
        mapping_profile=mapping_profile
    )
    return {"job_id": job["job_id"], "status": job["status"]}

@router.get("/jobs", response_model=PagedResponse[IngestionJob])
async def list_jobs(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    items, total = await repo.list_jobs(page, page_size)
    return PagedResponse[IngestionJob](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/jobs/{job_id}", response_model=IngestionJob)
async def get_job(job_id: str):
    job = await repo.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/jobs/{job_id}/retry")
async def retry_job(job_id: str):
    return {"job_id": job_id, "status": "running"}

@router.get("/jobs/{job_id}/rejected")
async def get_rejected_records(
    job_id: str,
    format: str = Query("json"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200)
):
    items, total = await repo.get_rejected(job_id, page, page_size)
    if format == "csv":
        output = io.StringIO()
        fieldnames = ["rejection_id", "job_id", "source_row_index", "raw_record_id", "stage", "error_code", "error_message", "rejected_at"]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for it in items:
            writer.writerow({
                "rejection_id": it.get("rejection_id", ""),
                "job_id": it.get("job_id", job_id),
                "source_row_index": it.get("source_row_index", ""),
                "raw_record_id": it.get("raw_record_id", ""),
                "stage": it.get("stage", ""),
                "error_code": it.get("error_code", ""),
                "error_message": it.get("error_message", ""),
                "rejected_at": str(it.get("rejected_at", ""))
            })
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="rejected_records_{job_id}.csv"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )

    return PagedResponse[RejectedRecord](
        data_status=DataStatus.live,
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )
