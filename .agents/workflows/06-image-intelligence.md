# Workflow 06 — Image Intelligence and Visual Recurrence

## Goal
Implement photo ingestion, detection, visual embeddings and historical photo matching as a first-class part of the asset memory timeline.

## Delegate
- `image-intelligence-engineer`: inference and multimodal matching.
- `mongodb-data-engineer`: GridFS bucket, collections, indexes, resumable media jobs.
- `fastapi-backend-engineer`: upload/analysis/history/review APIs.
- `dashboard-frontend-engineer`: photo evidence gallery, overlays and comparisons.
- `qa-evaluation-engineer`: image pair labels, leakage-safe evaluation and regression tests.

## Implementation sequence
1. Read `.agents/contracts/data-model.md`, `pipeline-contract.md` and `api-contract.md`.
2. Add the `media_files` GridFS bucket and image metadata/analysis collections. Verify MongoDB is local and persistent.
3. Implement secure streaming upload, content validation, checksum, optional EXIF GPS extraction with privacy controls, and explicit entity linking.
4. Implement resumable image jobs: orientation, duplicate check, YOLO inference, crop persistence and DINOv2 embedding generation.
5. Implement candidate retrieval with confirmed asset/source-ID and geospatial/time prefilters, then local cosine reranking.
6. Persist candidate evidence and human review decisions. Never auto-merge or auto-confirm recurrence.
7. Add asset timeline photo gallery, comparison view and localized labels.
8. Add pipeline dashboard metrics and model-status indicators.
9. Run tests for corrupt images, oversized uploads, duplicates, retries, model-version changes, missing GPS, different assets with similar damage and different defects on the same asset.
10. Produce a report separating implemented behaviour from unavailable labelled data or model-training limitations.

## Exit criteria
- Original image bytes round-trip from GridFS with checksum intact.
- Photo metadata links to complaint/asset/inspection/work order with provenance.
- Detections and full-image/crop embeddings are versioned and persisted.
- Historical visual candidates return separate visual, spatial, temporal and asset-ID evidence.
- Timeline displays photos and authorized comparison view.
- Human decisions are audited and reversible.
- No image-only candidate is counted as a confirmed recurrence or used as a validated failure probability.
