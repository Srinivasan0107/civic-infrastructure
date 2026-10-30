# API Response Contract

All endpoints use `/api/v1`. Return JSON with stable public IDs, typed payloads, pagination where needed, and data provenance metadata.

## Shared response metadata
```json
{
  "data_status": "live | partial | demo | unavailable",
  "last_updated": "UTC datetime or null",
  "source_count": 0,
  "coverage_notes": [],
  "items": []
}
```

## Overview
`GET /api/v1/overview?from=&to=&ward=&asset_type=`
Returns KPI values, trends, priority queue preview and data coverage. Every KPI includes a value, unit, comparison period if valid, and source/coverage note. Do not return fake zero for unknown values.

## Assets and timelines
- `GET /api/v1/assets?q=&asset_type=&ward=&priority_tier=&page=&page_size=`
- `GET /api/v1/assets/{asset_id}`
- `GET /api/v1/assets/{asset_id}/timeline?from=&to=&event_type=`
Return asset details, geometry, source IDs, verification state, linked complaints, inspections, maintenance actions, media references and event provenance.

## Semantic search and review
`POST /api/v1/semantic/search`
```json
{
  "query": "large pothole near the bus stop",
  "language": "en",
  "filters": {"ward": null, "asset_type": "road_segment", "from": null, "to": null, "radius_m": 500},
  "top_k": 20
}
```
Return ranked candidates with complaint ID, original text, optional translation, text similarity, spatial distance, date gap, category compatibility, candidate type, evidence explanation and asset link status.

`POST /api/v1/semantic/matches/{match_id}/review`
```json
{"decision": "same_asset | related_issue | different_asset | defer", "reason": "optional note"}
```
Must write an audit event and preserve previous decisions.

## Clusters
- `GET /api/v1/clusters?ward=&asset_type=&review_status=&page=`
- `GET /api/v1/clusters/{cluster_id}`
- `POST /api/v1/clusters/{cluster_id}/review` with `confirm | split | merge | reject` and reason.

## Prioritization
`GET /api/v1/prioritization?ward=&asset_type=&tier=&as_of=`
Return `score_type`, `score`, `tier`, component breakdown, evidence IDs, data sufficiency, generated timestamp, and method/model version. Do not name an uncalibrated score `failure_probability`.

## Ingestion
- `POST /api/v1/ingestion/files` multipart upload with source name, dataset type, mapping profile and terms URL.
- `GET /api/v1/ingestion/jobs?page=`
- `GET /api/v1/ingestion/jobs/{job_id}`
- `POST /api/v1/ingestion/jobs/{job_id}/retry`
- `GET /api/v1/ingestion/jobs/{job_id}/rejected?format=json|csv`

## Data quality
`GET /api/v1/data-quality` returns total raw/normalized/rejected records, missing coordinates, unresolved asset links, unknown dates, duplicate source records, media coverage, repair outcome coverage, source licence gaps and model embedding coverage.


## Image/media and visual matching
- `POST /api/v1/media/attachments` — multipart streaming upload; accepts relation metadata to link image with complaint, asset, inspection or maintenance action. Returns `attachment_id`, processing job ID and upload status.
- `GET /api/v1/media/attachments/{attachment_id}` — metadata, provenance and authorized media access information. Do not return base64 bytes.
- `GET /api/v1/media/attachments/{attachment_id}/analysis` — processing status, defect detections, model versions and linked crop metadata.
- `POST /api/v1/media/attachments/{attachment_id}/analyze` — enqueue/retry processing idempotently.
- `GET /api/v1/assets/{asset_id}/visual-history?from=&to=` — chronological image evidence and visual recurrence candidates for an asset.
- `GET /api/v1/visual/matches?asset_id=&review_status=&page=` — historical photo candidates with evidence.
- `POST /api/v1/visual/matches/{visual_match_id}/review` — `{ "decision": "same_asset_recurrence | related_damage | different_location_or_asset | not_comparable | defer", "reason": "optional note" }`; writes an audit event and preserves prior decisions.

Visual candidate payloads must keep `image_similarity`, `defect_class_agreement`, `spatial_distance_m`, `date_gap_days`, `asset_id_match`, `source_link_match`, model/preprocessing versions and verification state separate. The API must not describe a raw similarity score as a probability or confirmed recurrence.
