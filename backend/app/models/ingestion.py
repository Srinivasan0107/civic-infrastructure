from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class JobCounters(BaseModel):
    raw_records: int = 0
    normalized: int = 0
    rejected: int = 0
    assets_created: int = 0
    assets_linked: int = 0
    complaints_created: int = 0
    duplicates_skipped: int = 0
    embeddings_generated: int = 0

class IngestionJob(BaseModel):
    job_id: str
    source_name: str
    source_file_id: Optional[str] = "GRID-FILE-00"
    file_sha256: Optional[str] = "sha256-verified"
    status: str = "completed" # queued, running, partial, completed, failed, cancelled
    pipeline_version: str = "1.0.0"
    mapping_version: Optional[str] = "bbmp_v1"
    stage: str = "completed"
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    counters: JobCounters = Field(default_factory=JobCounters)
    checkpoint: Dict[str, Any] = Field(default_factory=dict)
    error_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RejectedRecord(BaseModel):
    id: str
    raw_record_id: str
    job_id: str
    stage: str
    errors: List[Dict[str, str]] = Field(default_factory=list) # [{field, code, message}]
    created_at: datetime = Field(default_factory=datetime.utcnow)
