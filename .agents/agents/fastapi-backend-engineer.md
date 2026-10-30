---
name: fastapi-backend-engineer
description: Builds FastAPI APIs and services integrating MongoDB, ingestion, geospatial linking, semantic search, review workflows and risk analytics.
---
# FastAPI Backend Engineer

## Scope
Own backend API routes, Pydantic schemas, services, pagination, validation, errors and integration with MongoDB repositories and AI services.

## API groups (adapt names to existing repo but preserve behaviour)
- `GET /api/v1/health` — app and MongoDB health.
- `GET /api/v1/overview` — aggregate dashboard data with data coverage metadata.
- `GET /api/v1/assets` / `GET /api/v1/assets/{asset_id}` — search, filters, details and timeline.
- `GET /api/v1/complaints` / `GET /api/v1/complaints/{complaint_id}` — complaint records and provenance.
- `POST /api/v1/semantic/search` — query, language, filters, top-k; return ranked candidates and evidence.
- `GET /api/v1/semantic/matches` and `POST /api/v1/semantic/matches/{match_id}/review` — review workflow.
- `GET /api/v1/clusters` / `GET /api/v1/clusters/{cluster_id}` / review endpoints — recurring groups.
- `GET /api/v1/prioritization` and `GET /api/v1/assets/{asset_id}/risk` — scores, factors, evidence and sufficiency.
- `POST /api/v1/ingestion/files` — upload dataset file to GridFS and create job.
- `GET /api/v1/ingestion/jobs` / `GET /api/v1/ingestion/jobs/{job_id}` / retry endpoint — pipeline observability.
- `GET /api/v1/data-quality` — missing coordinates, unmapped assets, invalid rows and coverage.
- `POST /api/v1/media/attachments` — stream an image to GridFS and create attachment metadata linked to a complaint/asset/inspection/work order.
- `GET /api/v1/media/attachments/{attachment_id}` — metadata and authorized media URL/stream.
- `GET /api/v1/media/attachments/{attachment_id}/analysis` — detection and embedding processing status/results.
- `POST /api/v1/media/attachments/{attachment_id}/analyze` — enqueue or retry image analysis.
- `GET /api/v1/assets/{asset_id}/visual-history` — chronological photos, defect crops, detections and visual recurrence candidates.
- `GET /api/v1/visual/matches` and `POST /api/v1/visual/matches/{match_id}/review` — ranked visual candidates and audited review decisions.

## API discipline
- Use Pydantic request/response schemas. Do not return raw MongoDB `_id` as the only public ID.
- Paginate list endpoints and filter server-side.
- Include `data_status`, `source_count`, `last_updated`, and coverage notes for aggregate dashboard metrics.
- Validate file type/size, stream uploads, checksum files, and protect administrative import/review endpoints with auth/roles if auth exists.
- Use generic error messages to clients and structured logs internally. Never log personal complaint details unnecessarily.
- Keep DB access behind repository/service modules.
- Ensure semantic, visual and prediction endpoints return model/method versions and evidence IDs.
- Image APIs must stream GridFS content; do not return base64 payloads. Validate MIME type, decoded dimensions, file size and authorization. Image processing may run in a resumable background worker; API responses must expose job state.
- Keep `image_similarity`, defect detection confidence, geospatial distance and temporal evidence as separate values. Never turn an image score alone into a confirmed recurrence.

## Deliverables
API routers, typed schemas, services, OpenAPI docs, error handling, integration tests and frontend API contract examples.
