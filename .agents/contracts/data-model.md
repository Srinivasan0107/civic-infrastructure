# Canonical MongoDB Data Model Contract

This is a logical contract; implementation may add fields but must not remove provenance, verification state, or source IDs.

## Shared metadata
Every normalized entity should include where relevant:
```json
{
  "_id": "MongoDB ObjectId",
  "created_at": "UTC datetime",
  "updated_at": "UTC datetime",
  "source": {
    "name": "BBMP / OSM / NYC311 / manual",
    "url": "publisher dataset URL",
    "file_id": "GridFS file ID or null",
    "job_id": "ingestion job ID or null",
    "record_id": "source record key",
    "retrieved_at": "UTC datetime",
    "license_url": "terms/licence URL",
    "coverage": "geographic/time coverage"
  },
  "verification": {
    "status": "verified | unverified | inferred | approximate | synthetic_demo",
    "method": "source_id | manual_review | spatial_candidate | model_candidate",
    "reviewed_by": null,
    "reviewed_at": null
  }
}
```

## `assets`
```json
{
  "asset_id": "RD-000001",
  "asset_type": "road_segment | road_defect | drain | streetlight | footpath | public_toilet | other",
  "name": null,
  "geometry": {"type": "LineString", "coordinates": [[77.60, 12.90], [77.61, 12.91]]},
  "location_text": null,
  "ward": null,
  "zone": null,
  "criticality": {"value": null, "source": null},
  "source_ids": [{"source": "OSM", "id": "way/123", "type": "way"}],
  "attributes": {},
  "verification": {"status": "unverified", "method": "source_import"}
}
```

## `complaints`
```json
{
  "complaint_id": "BBMP-2025-0001",
  "source_record_id": "source key",
  "description_original": "original text, unchanged",
  "description_analysis": "lightly normalized text for embedding only",
  "language": {"code": "kn", "confidence": 0.94, "detector": "model/version"},
  "translation": {"text": null, "target_language": null, "method": null, "review_status": "not_translated"},
  "category": "road",
  "subcategory": "pothole",
  "status": "open | in_progress | closed | unknown",
  "reported_at": "UTC datetime or null",
  "closed_at": null,
  "location": {"type": "Point", "coordinates": [77.60, 12.90]},
  "location_accuracy": "exact | approximate | ward_only | unknown",
  "ward": null,
  "candidate_asset_ids": [],
  "asset_id": null,
  "asset_link_status": "unresolved | candidate | confirmed | rejected",
  "embedding": {"model": "intfloat/multilingual-e5-base", "revision": null, "vector": [], "created_at": "UTC datetime"},
  "attachments": [],
  "source": {},
  "verification": {}
}
```

## `maintenance_actions`
```json
{
  "action_id": "WO-0001",
  "source_work_order_id": "source identifier or null",
  "asset_id": "RD-000001",
  "complaint_ids": [],
  "action_type": "patching | resurfacing | cleaning | replacement | inspection | other | unknown",
  "description": null,
  "started_at": null,
  "completed_at": null,
  "actual_cost": {"amount": null, "currency": "INR", "status": "recorded | unavailable | estimated"},
  "contractor": null,
  "outcome": "resolved | partially_resolved | unresolved | unknown",
  "evidence_attachment_ids": [],
  "source": {},
  "verification": {}
}
```

## Other collections

### `inspections`
`inspection_id`, `asset_id`, `inspection_at`, `findings_original`, `findings_language`, `severity` (with source/confidence), `inspector/source`, `attachment_ids`, `verification`, `source`.

### `attachments`
`attachment_id`, `gridfs_file_id`, `content_type`, `filename`, `sha256`, `captured_at`, `complaint_id`, `asset_id`, `inspection_id`, `metadata`, `source`, `verification`.

### `raw_records`
`source_name`, `source_file_id`, `job_id`, `source_record_id`, `row_number`, `payload_original`, `payload_hash`, `imported_at`, `mapping_version`, `processing_status`.

### `rejected_records`
`raw_record_id`, `job_id`, `stage`, `errors: [{field, code, message}]`, `created_at`.

### `ingestion_jobs`
`job_id`, `source_name`, `source_file_id`, `file_sha256`, `status`, `pipeline_version`, `mapping_version`, `stage`, `started_at`, `completed_at`, `counters`, `checkpoint`, `error_summary`.

### `semantic_matches`
`match_id`, `complaint_a_id`, `complaint_b_id`, `text_similarity`, `spatial_distance_m`, `date_gap_days`, `category_compatibility`, `source_asset_id_match`, `composite_rank`, `candidate_type`, `model_version`, `review_decision`, `review_reason`, `reviewed_by`, `reviewed_at`.

### `incident_clusters`
`cluster_id`, `member_complaint_ids`, `candidate_asset_ids`, `time_start`, `time_end`, `centroid` (only if computed from valid coordinates), `algorithm`, `parameters`, `model_version`, `review_status`, `review_history`.

### `asset_risk_snapshots`
`asset_id`, `score`, `tier`, `score_type` (`priority_score` until a validated probability model exists), `components: [{name, value, weight, contribution, evidence_ids}]`, `data_sufficiency`, `method_version`, `model_version`, `generated_at`.

### `source_registry`
`source_name`, `publisher`, `dataset_url`, `license_url`, `retrieved_at`, `geographic_coverage`, `time_coverage`, `field_mapping_profile`, `notes`.

### `audit_events`
`actor`, `action`, `entity_type`, `entity_id`, `before`, `after`, `reason`, `created_at`.

## Recommended indexes
- `assets.asset_id` unique; `assets.geometry` 2dsphere; `assets.source_ids.source + assets.source_ids.id` as appropriate.
- `complaints.complaint_id` unique where source IDs are globally unique; `complaints.asset_id + reported_at`; `complaints.category + status + reported_at`; `complaints.location` 2dsphere; `complaints.source.name + source.record_id` unique where feasible.
- `maintenance_actions.asset_id + completed_at`; source work-order ID unique by source.
- `inspections.asset_id + inspection_at`.
- `raw_records.job_id + row_number`; `raw_records.source_name + source_record_id` unique where source record ID exists.
- `ingestion_jobs.status + created_at`; `semantic_matches.review_decision + created_at`; `asset_risk_snapshots.asset_id + generated_at`.

Use partial indexes where source identifiers may be null. Verify index behaviour with the MongoDB version used in Docker Compose.


## Image/media records (mandatory)

Original image bytes and derived binary files live in GridFS bucket `media_files`. The `attachments` collection contains metadata and references only:
```json
{
  "attachment_id": "IMG-000001",
  "gridfs_id": "ObjectId",
  "parent_attachment_id": null,
  "kind": "original | thumbnail | defect_crop",
  "sha256": "hex digest",
  "perceptual_hash": "pHash or null",
  "mime_type": "image/jpeg",
  "width": 1920,
  "height": 1080,
  "captured_at": null,
  "uploaded_at": "UTC datetime",
  "location": {"type": "Point", "coordinates": [77.60, 12.90]},
  "location_accuracy": "exact | approximate | unknown",
  "links": [
    {"entity_type": "complaint | asset | inspection | maintenance_action", "entity_id": "...", "relation": "reported_with | inspected | before_repair | after_repair", "link_method": "source_id | manual_review | model_candidate"}
  ],
  "source": {},
  "verification": {},
  "processing_status": "queued | running | completed | partial | failed"
}
```
Do not expose sensitive EXIF or reporter data by default. Original bytes are preserved; public derivatives should have sensitive EXIF stripped. A derived crop references its original through `parent_attachment_id` and stores normalized bounding-box coordinates.

## `image_detections`
`detection_id`, `attachment_id`, `asset_type_scope`, `detector_name`, `detector_version`, `taxonomy_version`, `class_id`, `class_label`, `confidence`, `bbox_xyxy_normalized`, `crop_attachment_id`, `severity_proxy` (nullable and explicitly documented), `inference_at`, `verification_status`. Detector confidence is not damage severity. Do not infer physical dimensions from pixel boxes without calibration.

## `image_embeddings`
`embedding_id`, `attachment_id`, `detection_id` (null for full image), `embedding_scope` (`full_image | defect_crop`), `model_name` (default `facebook/dinov2-base`), `model_revision`, `preprocessing_version`, `dimension`, `vector`, `created_at`. Store vectors as numeric arrays in MongoDB for the local baseline. Never assume Atlas-only vector search is available; use metadata/geospatial pre-filtering and local cosine reranking.

## `visual_matches`
`visual_match_id`, `attachment_a_id`, `attachment_b_id`, `asset_a_id`, `asset_b_id`, `image_similarity`, `defect_class_agreement`, `spatial_distance_m`, `date_gap_days`, `asset_id_match`, `source_link_match`, `composite_rank`, `candidate_type` (`visual_recurrence_candidate | related_damage_candidate | duplicate_upload | insufficient_evidence`), `model_version`, `preprocessing_version`, `review_decision` (`same_asset_recurrence | related_damage | different_location_or_asset | not_comparable | defer | unreviewed`), `review_reason`, `reviewed_by`, `reviewed_at`, `review_history`.

## `media_processing_jobs`
`media_job_id`, `attachment_id`, `status`, `stage`, `pipeline_version`, `detector_version`, `embedding_model_version`, `counters`, `checkpoint`, `started_at`, `completed_at`, `error_summary`, `retry_count`.

## Image relationship rules
- A photo may be linked to several entities only with an explicit relation type and provenance.
- A `before_repair`/`after_repair` relationship must point to the relevant maintenance action. Do not infer success/failure from that relation alone.
- Store original image and crops in GridFS, not in MongoDB document fields. Store only metadata, normalized boxes and model vectors in collections.
- Add indexes: `attachments.attachment_id` unique; `attachments.sha256`; `attachments.perceptual_hash`; `attachments.links.entity_type + attachments.links.entity_id`; `attachments.location` 2dsphere; `attachments.captured_at`; `image_detections.attachment_id + class_label`; `image_embeddings.attachment_id + embedding_scope + model_name + model_revision`; `visual_matches.review_decision + created_at`; `media_processing_jobs.status + created_at`.
