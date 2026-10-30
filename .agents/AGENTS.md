# Civic Infrastructure Memory — Master Build Instructions

## 1. Product mission

Build a practical municipal dashboard that connects complaints, photographs, dates, locations, asset identifiers, inspections, and maintenance actions into a searchable timeline for each physical civic asset. The system must help municipal teams:
- retrieve an asset's complete available history;
- find semantically similar complaints, including across supported Indian languages;
- detect likely repeated/related incidents while respecting geography and time;
- identify assets that deserve inspection or maintenance attention first;
- understand why an asset received a priority score;
- inspect data quality and source provenance.

This is a decision-support platform. It must never silently decide that two reports concern the same physical asset, invent a repair, infer a root cause as fact, or present an unvalidated score as a calibrated failure probability.

## 2. Required capabilities / acceptance criteria

### A. Asset-centric memory
- Every tracked physical asset has a stable internal `asset_id` independent of source-system IDs.
- Support at minimum: road segment, pothole/road defect, drain, streetlight, footpath, and public toilet. The UI and schema must be extensible to other asset types.
- Asset detail page contains a chronological timeline of complaints, media, inspections, work orders, maintenance actions, outcomes, and source references.
- Timeline events show event date, event type, source, confidence/verification state, and provenance.
- Support filters by date, ward/zone, asset type, incident category, status, and source.

### B. Semantic complaint intelligence
- Use multilingual text embeddings; default model: `intfloat/multilingual-e5-base` (configurable, cached locally). For this model apply `query: ` to queries and `passage: ` to complaint text before encoding.
- Keep the original complaint text unchanged. Store detected language, optional human-reviewed translation, and embedding model/version separately.
- Semantic similarity is candidate discovery, not proof of identity. Combine text similarity with location distance, time window, category, source asset ID, and manual confirmation.
- Display the evidence behind a match: text similarity, distance, date gap, category compatibility, and whether the asset ID matched.
- Include actions to confirm same asset, mark different asset, mark related-but-not-duplicate, and undo a decision. Persist reviewer and timestamp.
- Do not merge complaint records destructively. Maintain links/relationships.

### C. Multimodal image intelligence — mandatory
- Photographs are first-class records linked to complaints, assets, inspections and maintenance actions. Store original bytes in local MongoDB GridFS bucket `media_files`; store metadata/links in `attachments`.
- Provide a road-damage detector using a configurable YOLO-family adapter. The initial road taxonomy maps RDD2022 `D00`, `D10`, `D20`, `D40` to longitudinal crack, transverse crack, alligator crack and pothole. Verify dataset/model/library licences before use or redistribution.
- Provide visual embeddings using `facebook/dinov2-base` by default (configurable and cached locally). Generate separate embeddings for the full image and detected defect crops. Record model/revision/preprocessing version.
- Add SHA-256 exact-duplicate detection and perceptual-hash near-duplicate detection; do not confuse duplicate uploads with recurring infrastructure damage.
- Retrieve historical image candidates using asset ID/source links and available geospatial/time/category filters before visual cosine-similarity ranking. Persist per-signal evidence: image similarity, defect-class agreement, distance, date gap, asset-ID agreement and model versions.
- Display historical photographs on each asset timeline and provide side-by-side comparison with optional detection overlays, source/date/location metadata and review state.
- Image similarity is candidate evidence, not proof of same asset or same physical defect. No automatic asset merge or confirmed recurrence from an image score alone. Human review must be auditable and reversible.
- Do not infer real-world defect size from pixel bounding-box size without camera calibration. Do not label repairs successful/failed from image similarity alone.
- MVP road detector does not imply trained detection for drains, streetlights, footpaths or public toilets. These may store images and generic embeddings, but defect-detection claims require representative labelled data and separate evaluation.
- Add image pipeline observability: stored/processed/failed images, duplicate counts, missing geotags, detections by class and unlinked images.

### D. Recurring incident clustering
- Find groups of related reports using embeddings plus spatial and temporal constraints; use HDBSCAN or a documented alternative only after candidate filtering.
- Do not cluster complaints solely because their text is similar when locations are far apart.
- Allow a municipal reviewer to merge/split clusters and record the reason.
- Show cluster size, first/most recent incident, affected assets, recurrence interval, open/closed counts, and evidence quality.

### E. Predictive / prioritization dashboard
- MVP uses a transparent, configurable rule-based priority score. Show the factors and contribution for every score.
- Candidate factors: confirmed recurrence count, time since last incident, severity, asset criticality, repair recurrence after a completed action, unresolved age, inspection findings, and data confidence.
- Never count an unverified semantic candidate as a confirmed recurrence.
- If repair outcomes or sufficiently labelled historical data are absent, label output `priority score` or `risk indicator`, not `probability of failure`.
- Only introduce supervised failure prediction when reliable outcome labels exist. Use temporal validation, asset-group-aware leakage checks, calibration, model versioning, and a documented evaluation report.
- Show uncertainty/data sufficiency. Provide “why prioritised” explanations and a route to inspect underlying records.

### F. Multilingual experience
- Initial required UI languages: English (`en`), Kannada (`kn`), Hindi (`hi`), Tamil (`ta`) and Telugu (`te`). All five must be implemented for initial release, with curated dictionaries and a persistent locale selector across both public and municipal experiences.
- All navigation, menus, buttons, filters, empty states, errors, charts, statuses, and help text must be localizable. No user-facing strings hardcoded in React components.
- Use `react-i18next` or an equivalent dictionary-based i18n layer. Provide a persistent language selector in the global header and remember the user's selection.
- Use a curated translation dictionary for UI strings. Do not machine-translate fixed UI labels at runtime as the only translation mechanism.
- Complaint text must retain its original script and language. Optional translated display must show original and translation side-by-side and identify translation status/source.
- Format dates, numbers, currency, and plural forms by locale. Use Unicode-safe fonts with appropriate Kannada, Devanagari, Tamil and Telugu glyph coverage.
- Add tests for missing keys and a manual review checklist for key critical workflows in all initial languages.

### G. Local MongoDB dataset pipeline — mandatory
- The development and demo environment must run against a local MongoDB instance, not a hosted database by default.
- Default URI: `mongodb://127.0.0.1:27017`; database: `civic_memory`.
- Include a Docker Compose service for local MongoDB with a persistent named volume and health check. Do not expose MongoDB publicly. Bind to localhost for local-only development.
- Store imported source files in MongoDB GridFS (`dataset_files`) and preserve original file metadata, checksum, source, license/terms URL, import time, and uploader. For large files, stream in chunks; do not load entire CSV/ZIP into memory.
- Store source rows in `raw_records`; store validated normalized entities in dedicated collections. Preserve source record IDs and provenance.
- The import pipeline must be repeatable/idempotent, resumable, chunked, observable, and auditable. Re-importing a file with the same checksum must not create duplicate entities.
- Track jobs, per-stage counts, rejected rows, validation errors, checkpoints, and schema/pipeline versions in MongoDB.
- Never silently discard invalid rows. Send them to `rejected_records` with error details and source row reference.
- Store imported source files in `dataset_files` GridFS and images/media in a separate `media_files` GridFS bucket; store metadata and links in MongoDB. Do not store large base64 blobs inside complaint documents. Persist image detections, full-image/crop embeddings, visual matches and image-processing jobs in dedicated collections.
- Create indexes for source IDs, asset IDs, dates, category/status, text search as appropriate, and `2dsphere` GeoJSON location fields.
- Semantic embeddings are stored with model name/version in MongoDB. Perform candidate filtering in MongoDB and cosine-similarity reranking in the local API process for the baseline implementation. Do not assume Atlas-only `$vectorSearch` is available on local Community MongoDB.

### H. Public portal and municipal dashboard (not complaint-only portal)
The frontend must provide two connected experiences: a citizen-facing public civic portal and a secure municipal intelligence dashboard. Follow `.agents/prompts/frontend-generation.md` and `.agents/workflows/07-build-public-and-municipal-frontend.md`.

Public routes include homepage, service catalogue/details, about, announcements, citizen issue reporting and authenticated citizen complaint history where supported. The homepage must include institutional identity/header, search, language selector, accessibility controls, citizen/employee entry points, announcement ticker, hero, service cards, API-backed statistics, public updates/gallery and a complete footer. Do not invent government seals, affiliations, contact details or live statistics.

Required municipal views:
1. Overview: tracked assets, new complaints, confirmed recurring incidents, high-priority assets, overdue work orders, data quality.
2. Asset map: map layers/filters, asset and incident markers, cluster overlays, selected-asset context.
3. Asset explorer: searchable asset list and detailed timeline.
4. Semantic analysis: natural-language search, similar complaint results, match evidence and reviewer controls.
5. Recurring incidents: clusters, recurrence metrics, trend view, cluster review.
6. Predictive prioritization: ranked assets, explainable factor breakdown, confidence/data sufficiency, filters.
7. Maintenance and cost analytics: spend and intervention summaries only where actual cost records exist; clearly label missing coverage.
8. Photo evidence: asset timeline gallery, side-by-side historical comparison, detector overlays and reviewable visual recurrence candidates.
9. Data pipeline: import jobs, source files, records ingested/rejected, missing coordinates, unmapped assets, duplicates, image processing counts, detections by class, unlinked photos, and model/index status.

### I. Visual design and accessibility
- Use a polished, calm municipal operations dashboard with a restrained claymorphism influence: soft elevated surfaces and tactile cards, but prioritize dense data readability, contrast, and professional restraint.
- Use responsive layouts for desktop/tablet/mobile. Desktop is the primary engineering workstation.
- Use accessible contrast, visible keyboard focus, semantic HTML, labelled controls, non-colour-only status indicators, and screen-reader-friendly chart summaries.
- Avoid decorative charts without a decision purpose. Every KPI or chart must answer a municipal operations question.

## 3. Recommended baseline stack

Use this stack unless the existing repository already has a working equivalent:
- Frontend: React + TypeScript + Vite, Tailwind CSS, accessible component primitives, React Router, TanStack Query, `react-i18next`, Recharts, and MapLibre GL JS.
- Backend: Python 3.11+, FastAPI, Pydantic v2, PyMongo, pandas/pyarrow for ingestion, Shapely for geometry validation, Sentence Transformers, scikit-learn, HDBSCAN (optional feature extra), PyTorch/Transformers and a configurable YOLO detector adapter.
- Database: local MongoDB 8.x via Docker Compose, GridFS for imported files and media.
- Embedding model: `intfloat/multilingual-e5-base`, configurable via environment variable and cached locally.
- Tests: pytest for backend and Vitest/Testing Library for frontend; Playwright for core workflows.

Do not introduce paid/hosted services as mandatory dependencies. External map tiles or model downloads may require internet; provide clear offline/degraded behaviour.

## 4. Data model contract

Create at least these collections:
- `dataset_files` (GridFS files collection + metadata): uploaded CSV/JSON/GeoJSON/ZIP source datasets and provenance.
- `media_files` (GridFS bucket): original photographs, thumbnails and derived defect crops; metadata remains in `attachments`.
- `ingestion_jobs`: source, file checksum, status, pipeline version, timestamps, counters, checkpoints, error summary.
- `raw_records`: exact source row payload, source name, source record key, file/job ID, row number, import timestamp.
- `rejected_records`: raw record reference, validation errors, stage, timestamp.
- `assets`: stable internal asset ID, type, geometry, address/ward/zone, source IDs, attributes, verification state.
- `complaints`: source ID, description original, language, translated text (optional), category, status, dates, source location, normalized GeoJSON point, candidate/resolved asset IDs, verification state, provenance.
- `attachments`: GridFS media file ID, explicit complaint/asset/inspection/maintenance-action links, capture/upload date, content type, checksum, dimensions, geotag accuracy, parent/crop relationship and provenance.
- `inspections`: asset ID, inspection date, findings, severity, inspector/source, media references, verification state.
- `maintenance_actions`: work order/source ID, asset ID, action type, start/completion dates, actual cost/currency, contractor (if permitted), outcome, evidence and provenance.
- `semantic_matches`
- `image_detections`
- `image_embeddings`
- `visual_matches`
- `media_processing_jobs`: attachment ID, stage/status, checkpoint, detector/embedding versions, counters, timestamps and error summary.
- `incident_clusters`: cluster ID, member complaint IDs, candidate asset IDs, time span, centroid/geometry, review status, algorithm/version.
- `asset_risk_snapshots`: asset ID, score, tier, component contributions, data sufficiency, method/model version, generated time, evidence record IDs.
- `source_registry`: dataset description, publisher, source URL, licence/terms, coverage, field mappings, import policy.
- `audit_events`: reviewer and admin actions affecting asset links, clusters, records, or scores.

GeoJSON coordinate order must be `[longitude, latitude]`. Use `2dsphere` indexes. Do not infer an asset location from ward centroid if exact coordinates are missing; mark it as approximate/unknown.

## 5. Dataset pipeline stages

Implement this order and expose it in the Data Pipeline dashboard:
1. Register source and validate terms/licence.
2. Upload original file into GridFS; compute SHA-256 checksum.
3. Parse supported formats in streaming/chunked mode.
4. Preserve every source row in `raw_records`.
5. Map source columns to canonical schema using a versioned mapping profile.
6. Normalize dates, categories, text, IDs, coordinates, currency, and status; preserve original values.
7. Validate; write failures to `rejected_records`.
8. Deduplicate using source system + source record ID/checksum, not fuzzy complaint text alone.
9. Resolve/link assets using source asset IDs first, then geospatial and category evidence; uncertain links remain candidates.
10. Generate language metadata and text embeddings; record model version.
11. Generate semantic candidate matches and incident clusters.
12. Recompute asset history aggregates and explainable priority snapshots.
13. Mark job complete/partial/failed with counts and downloadable error report.

Every stage must be idempotent, checkpointed, and observable. Never overwrite raw source rows.

## 6. Data source policy

Support pluggable importers for:
- BBMP grievance CSV exports (primary local complaint source when available).
- Bengaluru streetlight CSV/KML datasets (asset inventory where permitted).
- OpenStreetMap extracts / Overpass GeoJSON (geospatial reference; ODbL attribution obligations apply).
- RDD2022 India images/annotations (road-damage visual model training only; check dataset terms).
- NYC 311 and NYC DOT pothole work orders (supplementary NLP/maintenance workflow benchmarks, never labelled as Bengaluru operational data).

The importer must store source attribution, licence/terms URL, retrieval date, and geographic coverage. Do not scrape systems behind login, bypass rate limits, or assume public access means unrestricted reuse.

## 7. Privacy, provenance, and truthfulness

- Minimize personal data. Do not expose reporter names, personal phone numbers, or exact home addresses in general municipal dashboards.
- Preserve source provenance at record and field level where feasible.
- Clearly label records as `verified`, `unverified`, `inferred`, `approximate`, or `synthetic_demo`.
- Synthetic demo data must live in a clearly separate dataset/namespace and must never be mixed into real metrics or model evaluation.
- Do not fabricate repair costs, work orders, photos, timestamps, or outcomes.
- A missing field is `unknown`, not zero.
- Root-cause suggestions must be worded as hypotheses and show supporting observations.

## 8. Engineering standards

- Inspect the existing repository before changing architecture. Preserve working code and conventions.
- Implement vertical slices end-to-end; avoid placeholder buttons or fake charts.
- Provide loading, empty, error, and partial-data states.
- Validate all API input and handle malformed imports gracefully.
- Use pagination for large tables and server-side filtering.
- Add indexes and explain query assumptions.
- Keep secrets in environment variables; `.env.example` contains placeholders only.
- Add unit/integration tests for ingestion idempotency, geospatial matching, semantic candidate review, multilingual switching, and risk-score explanations.
- Update README with exact local setup, import commands, model cache details, and test commands.

## 9. Frontend generation and subagent coordination
- Use `public-portal-frontend-engineer` for public/citizen routes and `dashboard-frontend-engineer` for `/dashboard/*` routes.
- Use `multilingual-i18n-engineer` for English, Kannada, Hindi, Tamil and Telugu locale resources and QA.
- Semantic, image, geospatial and predictive specialists own their evidence/API contracts and model behavior; dashboard frontend consumes those contracts rather than duplicating model logic.
- The orchestrator coordinates shared design tokens, route registration, app shell, auth boundaries and final integration. Follow Workflow 07 and do not let subagents edit the same files concurrently.

## 10. Definition of done

A build is not complete until:
- Local MongoDB starts with persistent storage and health check.
- At least one CSV import works end-to-end and is visible in pipeline status.
- Raw rows, normalized complaints/assets, provenance and rejected rows are persisted in local MongoDB.
- Asset timeline can be searched and filtered.
- Similar-complaint results show explainable text and spatial evidence.
- Photos are stored in GridFS, processed by the configured detector/visual encoder, linked into asset timelines, and historical visual-match candidates show image, date, location and asset evidence.
- Image matching tests cover recurrence candidates, different defects on the same asset, similar defects at distant assets, viewpoint changes and duplicate uploads.
- A recurring incident cluster can be reviewed and corrected by an authorized user.
- Prioritization dashboard shows explainable factors and data-sufficiency state.
- English, Kannada, Hindi, Tamil and Telugu UI switching works without untranslated critical controls.
- The system clearly distinguishes real, unverified, inferred and synthetic records.
- Backend, frontend and end-to-end tests pass; known limitations are documented.
