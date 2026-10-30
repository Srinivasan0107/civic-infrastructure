# Local MongoDB Dataset Pipeline Contract

## Local runtime
- MongoDB is the default persistence layer: `mongodb://127.0.0.1:27017/civic_memory`.
- Docker Compose uses a persistent named volume and health check; local port binding only.
- Use GridFS for original imported files and large image/media files.
- Keep source files and normalized records traceable using `file_id`, `job_id`, source name and source record key.

## Stages and status
1. `registered` — source metadata and terms/license recorded.
2. `stored` — source bytes uploaded to GridFS and SHA-256 verified.
3. `parsed` — chunked rows parsed and preserved in `raw_records`.
4. `mapped` — source columns mapped to canonical fields.
5. `validated` — errors separated into `rejected_records`.
6. `normalized` — canonical entities upserted.
7. `asset_linked` — source IDs and spatial candidates resolved.
8. `embedded` — language metadata and semantic embeddings stored.
9. `matched` — semantic candidates produced; no automatic destructive merge.
10. `clustered` — spatially constrained recurring groups generated.
11. `prioritized` — asset score snapshots updated.
12. `completed` / `partial` / `failed` — final counts and error report saved.

## Operational guarantees
- Idempotency key: source name + source file SHA-256 + source row identity.
- If a source has no stable record ID, use a deterministic row hash plus file/job identity, but do not deduplicate two different rows solely because their natural-language text is similar.
- Stage checkpoints must allow a job to resume without duplicating prior writes.
- Keep the exact original payload immutable.
- Every mapping profile is versioned.
- Process files in chunks and cap upload/file size through configuration.
- Validate file type by content where practical, not extension alone.
- Protect upload endpoints and scan/validate archives against path traversal and zip bombs.
- GridFS stores bytes; `raw_records` stores row payloads; normalized collections store canonical documents.
- Pipeline dashboard reads actual job counters and data-quality metrics from MongoDB.

## Minimum supported imports
- CSV with configurable mapping profile.
- JSON array / JSON Lines.
- GeoJSON FeatureCollection.
- ZIP containing one or more supported files (safe extraction/streaming).
- Image files as media attachments linked to complaints/assets/inspections/maintenance actions. Images are stored in GridFS bucket `media_files`; metadata is stored in `attachments`.

## Canonical pipeline output
- complaint rows -> `complaints`;
- asset inventory rows -> `assets`;
- work-order rows -> `maintenance_actions`;
- inspection rows -> `inspections`;
- image metadata and links -> `attachments`; original bytes, thumbnails and defect crops -> GridFS bucket `media_files`; detector results -> `image_detections`; full-image/crop vectors -> `image_embeddings`; historical candidate pairs -> `visual_matches`; resumable processing state -> `media_processing_jobs`;
- all rows -> `raw_records` before normalization.

Do not presume every dataset has every field. Missing coordinates, dates, asset IDs, repair costs and outcomes must be visible as coverage gaps.


## Image processing sub-pipeline
1. Validate MIME/content, decodeability, dimensions and configured file-size limits.
2. Stream original bytes into `media_files` and record SHA-256/source/licence/link provenance in `attachments`.
3. Read EXIF orientation; preserve original bytes. Extract GPS only where permitted and retain its accuracy/provenance. Strip sensitive EXIF from derived/public copies.
4. Compute pHash for near-duplicate upload detection. Duplicate upload detection is not a recurring-incident decision.
5. Run the configured YOLO-family road-defect detector; persist class, normalized bounding box, confidence and detector/taxonomy versions. RDD2022 mappings are road-only until other asset types have labelled training data.
6. Store defect crops and generate DINOv2 embeddings for full image and crop. Persist model revision and preprocessing version with each vector.
7. Retrieve historical candidates by confirmed asset/source link and available spatial/time/category metadata before local cosine similarity ranking.
8. Persist image similarity, class agreement, distance, date gap, asset match, model versions and candidate explanation. Do not use an arbitrary universal similarity threshold.
9. Route uncertain results to human review. Preserve decision history; never automatically merge assets or confirm recurrence.
10. Refresh image metrics, asset photo timelines and (only where validated) priority evidence.

Image jobs must be resumable and idempotent. A retry must not create duplicate attachments, crops, embeddings or visual-match rows for the same attachment/model/preprocessing version.
