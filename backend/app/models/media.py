from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from app.models.common import Verification, Source, GeoPoint, VerificationStatus

class ProcessingStatus(str, Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    partial = "partial"
    failed = "failed"

class AttachmentLink(BaseModel):
    entity_type: str # complaint, asset, inspection, maintenance_action
    entity_id: str
    relation: str # reported_with, inspected, before_repair, after_repair
    link_method: str = "source_id"

class Attachment(BaseModel):
    attachment_id: str
    gridfs_id: str
    parent_attachment_id: Optional[str] = None
    kind: str = "original" # original, thumbnail, defect_crop
    sha256: str
    perceptual_hash: Optional[str] = None
    mime_type: str = "image/jpeg"
    width: Optional[int] = None
    height: Optional[int] = None
    captured_at: Optional[datetime] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    location: Optional[GeoPoint] = None
    location_accuracy: str = "unknown"
    links: List[AttachmentLink] = Field(default_factory=list)
    source: Source = Field(default_factory=Source)
    verification: Verification = Field(default_factory=Verification)
    processing_status: ProcessingStatus = ProcessingStatus.completed

class ImageDetection(BaseModel):
    detection_id: str
    attachment_id: str
    detector_name: str = "YOLO_RDD2022_adapter"
    detector_version: str = "1.0.0"
    class_id: str # D00, D10, D20, D40
    class_label: str # longitudinal crack, transverse crack, alligator crack, pothole
    confidence: float
    bbox_xyxy_normalized: List[float] # [x1, y1, x2, y2]
    crop_attachment_id: Optional[str] = None
    severity_proxy: Optional[str] = None
    inference_at: datetime = Field(default_factory=datetime.utcnow)
    verification_status: VerificationStatus = VerificationStatus.unverified

class AttachmentAnalysis(BaseModel):
    attachment_id: str
    processing_status: ProcessingStatus = ProcessingStatus.completed
    detections: List[ImageDetection] = Field(default_factory=list)
    full_image_embedding_id: Optional[str] = None
    crop_embedding_ids: List[str] = Field(default_factory=list)
    model_versions: Dict[str, str] = Field(default_factory=dict)
    error_summary: Optional[str] = None

class VisualMatch(BaseModel):
    visual_match_id: str
    attachment_a_id: str
    attachment_b_id: str
    asset_a_id: Optional[str] = None
    asset_b_id: Optional[str] = None
    image_similarity: float
    defect_class_agreement: Optional[bool] = None
    spatial_distance_m: Optional[float] = None
    date_gap_days: Optional[int] = None
    asset_id_match: Optional[bool] = None
    source_link_match: Optional[bool] = None
    composite_rank: int
    candidate_type: str # visual_recurrence_candidate, related_damage_candidate, duplicate_upload, insufficient_evidence
    model_version: str = "facebook/dinov2-base"
    preprocessing_version: str = "1.0.0"
    review_decision: str = "unreviewed" # same_asset_recurrence, related_damage, different_location_or_asset, not_comparable, defer, unreviewed
    review_reason: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    review_history: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VisualReviewRequest(BaseModel):
    decision: str
    reason: Optional[str] = None
    reviewer: Optional[str] = "admin"
