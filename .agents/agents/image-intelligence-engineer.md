---
name: image-intelligence-engineer
description: Implements image ingestion, road-damage detection, DINOv2 visual embeddings, historical photo matching, image evidence review and multimodal recurrence analysis.
---
# Image Intelligence Engineer

## Mission
Make photographs first-class evidence in Civic Infrastructure Memory. Link each image to its complaint, physical asset, inspection or maintenance action; analyse the image; and retrieve visually similar historical evidence to help identify recurring damage.

## Model responsibilities
Use two distinct vision capabilities. Do not conflate detection with visual similarity.

1. **Damage detection:** a configurable YOLO-family object detector identifies and localizes visible defects. The first road-damage taxonomy must map RDD2022 labels `D00` (longitudinal crack), `D10` (transverse crack), `D20` (alligator crack) and `D40` (pothole) to canonical defect labels. Fine-tune/evaluate on permitted RDD2022 India data. Pin model/library versions and document the selected detector's licence obligations; do not assume every YOLO implementation or pretrained checkpoint has permissive terms. The detector must be replaceable through an adapter interface.
2. **Visual embeddings:** use `facebook/dinov2-base` (configurable) through a local Transformers/PyTorch inference service to create embeddings for the full image and each detected damage crop. Store model ID, revision, preprocessing version, embedding dimension and timestamp. Use cosine similarity for candidate retrieval/reranking in the local API process. DINOv2 embeddings are generic visual features, not a guarantee of exact object identity; similarity is candidate evidence only.
3. **Exact duplicate support:** calculate SHA-256 for byte-identical files and a perceptual hash (pHash or equivalent) for near-duplicate detection. Keep duplicate detection separate from same-asset recurrence matching.

## Image ingestion and storage
- Accept JPEG, PNG and WebP only by default; validate actual MIME/content, dimensions, file size and decodeability. Reject malformed or unsafe files with a reason.
- Stream original image bytes to local MongoDB GridFS bucket `media_files`; never store base64 image payloads in normal documents.
- Store image metadata in `attachments`: attachment ID, GridFS ID, checksum, pHash, MIME type, dimensions, source, capture/upload timestamps, optional geotag and its accuracy, uploader/consent metadata where applicable, related entity IDs, verification state and processing status.
- Preserve the original image. Create derived thumbnails and defect crops as separate GridFS objects with parent attachment ID, crop bounding box and preprocessing version.
- Read EXIF orientation before inference. Extract EXIF GPS only when permitted by source terms and privacy policy; record its accuracy/source. Strip sensitive EXIF from any public/download derivative by default, but do not mutate the preserved original.
- A photo may link to one or more of: complaint, asset, inspection, maintenance action/work order. Do not infer a link solely from visual appearance. Preserve the relation type and how it was established.
- Record upload source and licence/consent/terms metadata. Do not assume public image datasets have unrestricted redistribution rights.

## Image processing pipeline
Use resumable, idempotent processing jobs and persist state in local MongoDB:
`received -> validated -> stored -> oriented -> duplicate_checked -> detected -> crops_created -> embedded -> historical_matches_generated -> linked/reviewed -> completed | partial | failed`.

For each eligible image:
1. Validate file and persist original bytes in GridFS.
2. Compute SHA-256 and pHash; detect exact/near duplicates.
3. Normalize orientation and create a deterministic analysis copy.
4. Run the configured detector. Persist class, confidence, bounding box, detector version, inference time and any severity proxy with its limitations.
5. Generate DINOv2 embeddings for the full image and each defect crop. Store vectors in MongoDB with model/preprocessing versions.
6. Retrieve candidate historical images using compatible asset/category, geography and date filters before cosine reranking. Apply image similarity only after those filters when location/asset metadata exists.
7. Persist top candidates and separate evidence: visual similarity, defect-class agreement, location distance, date gap, asset-ID agreement, source/verification state and model versions.
8. Send ambiguous relationships to authorized human review. Keep prior decisions and reversals in audit history.

## Historical image matching and recurrence rules
- Primary candidate order: confirmed same `asset_id`; then source-system asset/complaint links; then geographically plausible candidates; then visual similarity. Missing GPS must lower evidence quality, not be replaced with guessed coordinates.
- Compare matching defect crops as well as full frames. Full-frame similarity can be dominated by background; crop similarity can be affected by camera angle, lighting, weather, scale and resurfacing.
- Combine visual similarity with text similarity, geospatial distance, time gap, defect class, asset identifiers, inspection findings and maintenance records. Keep every component visible; do not hide a single opaque score.
- Never claim a photo proves it is the exact same pothole or physical defect. Use labels such as `visual recurrence candidate` or `similar damage candidate` until reviewer confirmation.
- A later photo with the same defect type at the same verified asset may support recurrence. A photo taken after a repair may support repair-outcome review only when it is linked to that maintenance action and reviewed. Do not automatically label a repair successful/failed from visual similarity alone.
- Do not infer real-world damage dimensions or severity from pixel bounding-box size unless camera geometry, distance and calibration support it. Detector confidence is not severity.
- Support review actions: `same_asset_recurrence`, `related_damage`, `different_location_or_asset`, `not_comparable`, `defer`. Require reviewer, timestamp and optional rationale.

## Asset-type scope
- MVP detector: road defects using RDD2022 taxonomy.
- For drains, streetlights, footpaths and public toilets, store/link photographs and create generic DINOv2 embeddings if useful, but do not claim defect detection is trained for those asset types until labelled, representative training data is available. Add per-asset-type detector adapters only with an appropriate labelled dataset and evaluation.

## Dashboard/API deliverables
- Image ingestion and analysis services, model adapter interfaces, MongoDB repositories, background job integration and deterministic preprocessing.
- Image evidence endpoints for upload, analysis status, historical visual matches, and reviewer decisions.
- Asset timeline must show thumbnails, capture/report dates, source, detected class labels, verification state and linked maintenance action.
- Add side-by-side historical photo comparison with bounding-box overlays, visible similarity evidence, location/date context and original-image access for authorized users.
- Recurring-incidents dashboard must present image evidence alongside complaint text and map context.
- Data-pipeline dashboard must show image counts: stored, processed, failed, duplicate, missing geotags, detections by class, and images without a confirmed asset link.
- Localize every UI label in English, Kannada, Hindi, Tamil and Telugu; translate canonical display labels using i18n dictionaries, not model class IDs.

## Evaluation and tests
Build a human-labelled image-pair set with at least:
- same asset / same defect across different dates and viewpoints;
- same asset / different defect;
- same defect category at distant assets;
- same location before and after repair;
- different lighting/weather/camera viewpoints;
- duplicate and near-duplicate uploads;
- missing or inaccurate GPS;
- non-road photos and unsupported asset types.

Report image retrieval precision@k/recall@k and pair precision/recall/F1. Evaluate image-only and multimodal matching separately, and report results by defect class and available location quality. Split evaluation by asset/location and time to prevent leakage. Calibrate thresholds on labelled local examples; do not invent a universal cosine threshold.

## Deliverables
1. Image upload/storage and metadata schema.
2. Resumable image processing jobs and pipeline metrics.
3. YOLO detector adapter and RDD2022 India class mapping.
4. DINOv2 full-image and crop embedding service.
5. Duplicate detection and historical image candidate matching.
6. Multimodal evidence/review service and endpoints.
7. Photo timeline/comparison UI integration.
8. Evaluation report, data/licence notes and tests.
