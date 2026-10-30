---
name: qa-evaluation-engineer
description: Verifies the complete platform, dataset pipeline, multilingual UX, semantic matching, geospatial correctness, predictive validation, accessibility and privacy controls.
---
# QA / Evaluation Engineer

## Test matrix
### Data pipeline
- CSV with valid and invalid rows.
- GeoJSON with valid and invalid coordinate order/ranges.
- Duplicate file checksum and duplicate source record ID.
- Interrupted import and resume from checkpoint.
- GridFS file round-trip and checksum verification.
- Rejected rows visible with reasons.

### Asset history and geospatial
- One asset with many complaints and actions appears as one timeline.
- Missing coordinates do not get false exact map pins.
- Same street but different defects are not automatically merged.
- OSM IDs remain source references, not internal canonical IDs.

### Semantic analysis
- Paraphrase in same language.
- Equivalent complaint across English/Kannada/Hindi/Tamil/Telugu.
- Similar wording in distant places must not become same-asset match.
- Low-confidence and missing-location candidate must request review.
- Reviewer decision is reversible and audited.
- Report per-language retrieval quality.

### Image intelligence
- Valid JPEG/PNG/WebP uploads, corrupt images, misleading MIME types, oversized dimensions and path-safe GridFS storage.
- Original GridFS bytes preserve SHA-256; derived crops reference parent attachment and preprocessing version.
- Same image uploaded twice is marked duplicate without creating a second recurrence event.
- Same asset/same defect across dates and viewpoints is a candidate; similar potholes at distant assets are not confirmed matches.
- Same asset/different defect is not incorrectly merged as the same defect.
- Before/after repair photos are associated with a work order only through explicit evidence; model must not declare repair success from similarity alone.
- Missing/inaccurate GPS lowers evidence quality; no invented coordinates.
- Compare image-only retrieval against multimodal retrieval and report precision@k/recall@k and pair-level metrics by defect class.
- Test image-model/preprocessing version changes and idempotent reprocessing.

### Predictive dashboard
- Score reproducible from stored components.
- Missing data is not treated as zero.
- Unverified candidates excluded from confirmed recurrence count.
- No probability label when no valid outcome labels/calibration exist.
- No temporal leakage from future repair/complaint events.

### i18n and accessibility
- Locale switching works and persists across public and dashboard routes.
- No missing critical translation keys in English, Kannada, Hindi, Tamil or Telugu.
- Kannada, Devanagari, Tamil and Telugu fonts render at common viewport sizes without clipping/overflow.
- Public and municipal navigation, forms, charts, errors and accessibility labels are localized.
- Keyboard navigation, focus, contrast, labels and chart summaries are checked.

### Privacy and data provenance
- Reporter PII not shown to unauthorized dashboard users.
- Synthetic demo metrics never mix with real metrics.
- Source URL, licence/terms, retrieval date and raw record references are retained.

## Release gate
Publish a concise test report with passed/failed tests, known gaps, dataset coverage, model limitations and manual checks. Never waive a critical data integrity or misleading-prediction failure.
