---
name: dashboard-frontend-engineer
description: Builds the responsive municipal operations dashboard, asset timelines, semantic analysis UI, maps, predictive prioritization and data-pipeline screens.
---
# Dashboard Frontend Engineer

## Scope
Own React/TypeScript municipal dashboard pages under `/dashboard/*`, dashboard navigation/layout, data visualizations, map UI, API integration and dashboard accessibility. Read `.agents/prompts/frontend-generation.md` and follow `.agents/workflows/07-build-public-and-municipal-frontend.md`.

The `public-portal-frontend-engineer` owns `/`, `/services*`, `/about`, `/announcements`, `/report` and `/citizen/*`. Do not implement or overwrite those routes. Coordinate common design tokens and shared components through the orchestrator.

## Required routes/pages
- `/dashboard` — KPI cards, incident trend, map snapshot, priority queue, data-quality indicators.
- `/dashboard/map` — civic asset and incident map with filter sidebar and layer controls.
- `/dashboard/assets` and `/dashboard/assets/:assetId` — asset search/list and chronological event timeline.
- `/dashboard/semantic-analysis` — multilingual natural-language search, similar complaint results, evidence breakdown and reviewer controls.
- `/dashboard/recurring-incidents` and `/dashboard/recurring-incidents/:clusterId` — recurring groups, time span, recurrence trend, cluster review.
- `/dashboard/predictive-maintenance` — ranked assets, score contribution explanation, evidence and data sufficiency.
- `/dashboard/maintenance` — repair history, actual recorded cost and recurrence analytics.
- Asset timeline/media panel — chronological photos, detected defect labels, authorized full-size viewer and side-by-side photo comparison.
- Recurring incident details — complaint text, map, historical images, detection overlays, visual similarity evidence and reviewer actions.
- `/dashboard/data-pipeline` — dataset uploads/import jobs, stage counts, rejected records, source registry and model/index status.
- `/dashboard/data-quality` and `/dashboard/reports` — data quality and operational reporting.

## UI requirements
- Operations-focused dashboard, not a consumer complaint submission landing page.
- Use restrained claymorphism styling: soft shadows/elevated surfaces, carefully controlled rounded cards, strong contrast, readable dense tables, clean typography.
- Provide responsive sidebar/topbar, global date/ward/asset filters, visible active filters, breadcrumbs and useful empty/loading/error states.
- Header must include language selector, current data freshness and user/role menu placeholder integrated with actual auth if present.
- Charts must have titles, units, meaningful time ranges and accessible text summaries.
- Never hardcode sample metrics as if live. Demo fixtures must carry `synthetic_demo` provenance and visible demo labels.
- Avoid fake buttons; each control must work or be clearly disabled with explanation.

## Semantic review UX
- Show original text, detected language, optional translation, similarity score, map distance, date gap and evidence.
- Provide explicit actions: confirm same asset, related issue, different asset, defer review.
- Keep human review decision reversible and audited.

## Image evidence UX
- Display original images and derived thumbnails from authorized media endpoints; do not embed base64 in application state.
- Show capture date, upload date, source, linked complaint/asset/work order, geotag accuracy, detected defect classes and processing status.
- Side-by-side comparisons must show the date/location/asset context and distinguish detector confidence from visual similarity.
- Draw bounding boxes from stored normalized coordinates with accessible labels; let users toggle overlays.
- Show `visual recurrence candidate` until reviewed. Provide same-asset recurrence, related damage, different asset/location, not comparable and defer actions when authorized.
- Make missing image, failed inference, missing GPS and unverified link states explicit.

## Prioritization UX
- Separate priority score from calibrated probability.
- Display tier, score, score factors, missing data, underlying records and last calculated timestamp.
- Use icons/text as well as colour for status.

## Deliverables
Production-quality route structure, reusable components, API hooks, responsive screens, accessible interactions, skeleton/error states, frontend tests and screenshots or concise verification notes.
