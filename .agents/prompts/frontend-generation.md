# Frontend Generation Prompt — Civic Infrastructure Memory

## Objective
Generate a complete, responsive, multilingual web application for Civic Infrastructure Memory. It must combine a citizen-facing municipal digital-services portal with a secure municipal intelligence dashboard. The product's central function is to connect complaints, photographs, dates, locations, stable asset identifiers, inspections and maintenance actions into a searchable history for each civic asset, then support semantic complaint matching, image-based historical comparison, recurring-incident analysis and evidence-based maintenance prioritization.

This must be a working application, not a static mockup or a complaint-registration-only portal.

## Non-negotiable implementation approach
1. Read root `AGENTS.md`, `.agents/AGENTS.md`, `.agents/agents/orchestrator.md`, relevant specialist profiles and API/data contracts before coding.
2. Inspect the existing repository and preserve its conventions. Do not replace working architecture without justification.
3. Delegate public portal, municipal dashboard, multilingual UX, backend/data integration, maps, semantic/image/predictive feature integration and QA to specialist subagents using `.agents/workflows/07-build-public-and-municipal-frontend.md`.
4. Establish shared route names, design tokens, component contracts and API response types before parallel UI work.
5. Implement vertical slices connected to APIs. Use demo fixtures only in an explicitly labelled demo mode and keep them isolated from real metrics.
6. Do not invent metrics, assets, complaints, images, repair costs, outcomes, coordinates, government affiliations or predictions.

## Product experience and routes
Build two connected experiences with a shared design system.

### A. Public civic portal
- `/` — public homepage.
- `/services` and `/services/:serviceId` — civic service catalogue/details.
- `/about` — platform purpose, workflow, governance and data approach.
- `/announcements` — public notices and updates.
- `/report` — citizen issue-reporting entry point.
- `/citizen/complaints` and `/citizen/complaints/:complaintId` — citizen complaint history/details when authentication and API support exist.
- `/login` — role-aware login entry for citizen and employee; integrate real auth if present.

Homepage sections:
1. Institutional header: product identity, portal search, language selector, accessibility controls, Citizen Login and Employee Login.
2. Primary navigation: Home, Services, About, Announcements, Contact/Help.
3. Announcement ticker populated from backend data.
4. Hero heading: “Building Better Cities Through Infrastructure Intelligence”. Supporting message: connect civic complaints, infrastructure history and intelligent maintenance insights to support reliable urban services. CTAs: Report a Civic Issue, Explore the Platform, Discover Services.
5. About section explaining asset-level institutional memory.
6. Service cards: Road Infrastructure, Drainage Management, Streetlights, Footpaths, Public Facilities, Asset Registry, Maintenance Services, Complaint Intelligence and Infrastructure Insights.
7. Key statistics sourced from APIs: tracked assets, complaints, resolved complaints, confirmed recurring incidents, maintenance interventions and high-priority assets. Each statistic must show freshness and coverage; never hardcode fake live statistics.
8. Recent public announcements and infrastructure updates.
9. Photo gallery with valid image provenance, permission and attribution.
10. Verified department/partner information only; do not invent official affiliations or seals.
11. Footer: about, services, accessibility, privacy, terms, contact and help.

### B. Municipal intelligence dashboard
- `/dashboard` — command center.
- `/dashboard/map` — infrastructure and incident map.
- `/dashboard/assets` — searchable asset registry.
- `/dashboard/assets/:assetId` — asset profile and chronological history.
- `/dashboard/semantic-analysis` — multilingual complaint similarity and review.
- `/dashboard/image-intelligence` — defect detection and historical image comparison.
- `/dashboard/recurring-incidents` and `/dashboard/recurring-incidents/:clusterId` — incident clusters and recurrence evidence.
- `/dashboard/predictive-maintenance` — explainable asset priority/risk indicators.
- `/dashboard/maintenance` — work orders, inspections and maintenance timeline.
- `/dashboard/reports` — infrastructure and expenditure reporting.
- `/dashboard/data-pipeline` — dataset ingestion and processing observability.
- `/dashboard/data-quality` — missing fields, unresolved links, source coverage and quality controls.

Dashboard shell:
- Responsive collapsible sidebar grouped into Overview, Infrastructure, Complaint Intelligence, AI Intelligence, Operations, Data Management and Reports.
- Top bar with municipality/ward/date filters, global search, locale selector, data freshness, notifications and authenticated user/role menu.
- Breadcrumbs, clear active-filter chips and contextual page actions.
- Restrict sensitive municipal screens according to actual authentication/role capabilities. Do not simulate authorization as security.

## Visual system
Create an original, polished government digital-services identity:
- Clean white and light-neutral base surfaces.
- Deep navy and blue primary identity.
- Teal/green for positive statuses, amber for warnings and red for critical issues.
- Restrained claymorphic card elevation with subtle shadows, quiet borders and consistent rounded corners.
- Clear typography, strong hierarchy, generous but purposeful spacing, and information-dense tables that remain readable.
- Professional charts, maps and timelines; restrained motion only where it improves feedback.
- Avoid neon palettes, gaming aesthetics, excessive gradients, excessive glass effects, unnecessary 3D and ornamental animation.
- Use real/licensed civic imagery; no invented government seals, badges or institutional endorsements.
- Design must be responsive across desktop, tablet and mobile.

## Municipal command center
Show API-backed KPI cards for tracked assets, complaints, confirmed recurring incidents, high-priority assets, overdue work orders and data quality. Include time-series trends, category distribution, ward comparisons, maintenance expenditure where recorded, asset condition distribution, a map preview and an explainable priority queue. Every chart must have a title, units, period, accessible summary and data-coverage state.

## Semantic complaint analysis
Use the backend's multilingual E5-based service; the frontend must not reimplement embeddings in the browser. Display original complaint text, detected language, optional labelled translation, semantic similarity, geographic distance, date gap, category compatibility, asset-ID agreement and matching explanation. Provide review actions: Confirm Same Asset, Related Issue, Different Asset, Defer and Undo where authorized. Similarity is candidate discovery, never proof of identity. Do not destructively merge complaint records.

## Image intelligence
Display original photographs and derived thumbnails through authorized media endpoints; never store base64 image blobs in frontend state. Show capture/upload dates, source, complaint/asset/work-order links, geotag quality, detector classes, processing state, YOLO bounding boxes and DINOv2 visual similarity as separate evidence. Provide side-by-side comparison, optional detection overlays, historical photo timeline and human review actions. Label unreviewed results as visual recurrence candidates. Image similarity alone cannot prove the same asset or same physical defect.

## Recurring incident analysis
Show cluster size, first/most recent occurrence, recurrence intervals, affected assets, open/closed counts, complaint records, photographs, maintenance links, evidence quality and review state. Authorized users can confirm, split, merge or reject clusters with reason/audit history. Do not cluster similar text across distant locations as one physical issue.

## Predictive maintenance and prioritization
Use backend-provided explainable priority scores. Display tier, score, component contributions, evidence records, data sufficiency, method/model version and calculation timestamp. Do not display an uncalibrated score as a failure probability. Missing information is unknown, not zero. Allow drill-down from each recommendation to the supporting asset timeline and records.

## Asset registry and timeline
Each asset detail page must include stable internal asset ID, category, location/geometry and precision, source identifiers, condition, complaints, images, inspections, work orders, maintenance actions, recorded costs, outcomes, recurrence evidence and priority snapshots. Render all events in a chronological searchable/filterable timeline with source and verification labels. Never infer precise coordinates from ward centroids.

## Maintenance and expenditure
Show work order ID, asset ID, complaint reference, department, contractor where authorized, inspection/start/completion dates, action type, actual recorded cost and currency, before/after photos and outcome. Only sum actual recorded costs. Missing costs must remain unknown.

## Dataset pipeline dashboard
Connect to backend APIs backed by local MongoDB. Show source registration, GridFS upload, parsing, raw record preservation, schema mapping, validation, rejected rows, deduplication, geospatial normalization, asset resolution, text embedding, image inference, clustering, risk calculation and dashboard aggregation. Show dataset/source/licence, checksum, upload time, records processed/rejected, stage status, checkpoints, errors and retry/resume controls where supported. Frontend must never connect directly to MongoDB.

## Mandatory multilingual experience
Initial UI languages: English (`en`), Kannada (`kn`), Hindi (`hi`), Tamil (`ta`) and Telugu (`te`). Use `react-i18next` or existing equivalent with curated translation dictionaries and namespaces. Every visible UI string—including navigation, chart labels, filters, tooltips, empty/loading/error states, validation, accessibility text, notifications and modal actions—must be localized. Keep original complaint text unchanged and show optional machine/human translation with clear provenance. Persist locale preference and format dates/numbers/currency with locale-aware APIs. Use fonts with proper glyph coverage for Kannada, Devanagari, Tamil and Telugu. Missing locale keys must be tested; English fallback is allowed only as a safety fallback and must be reported by QA. Do not claim translation quality is human-reviewed unless it is.

Required locale files:
- `src/locales/en/translation.json`
- `src/locales/kn/translation.json`
- `src/locales/hi/translation.json`
- `src/locales/ta/translation.json`
- `src/locales/te/translation.json`

BHASHINI integration, if available, must be called through a backend adapter with configured credentials; do not assume API access or expose credentials in the browser.

## AI assistant
Provide a role-aware assistant interface for questions about asset history, complaint patterns, ward-level recurrence, maintenance costs and inspection priorities. Answers must be grounded in backend records and show linked asset/complaint/work-order IDs. Do not fabricate answers when information is absent.

## Preferred frontend stack
Use existing compatible tools first. Otherwise prefer React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Recharts, MapLibre or Leaflet, `react-i18next` and Lucide icons. Use typed API clients and reusable components. Follow existing lint/build/test conventions.

Suggested structure:
- `src/components/layout`, `navigation`, `cards`, `charts`, `maps`, `tables`, `timeline`, `image-analysis`, `forms`, `common`
- `src/pages/public`, `citizen`, `dashboard`, `semantic`, `image-intelligence`, `predictive`, `assets`, `maintenance`, `data-pipeline`
- `src/locales/{en,kn,hi,ta,te}`
- `src/hooks`, `services`, `api`, `types`, `utils`, `routes`

## API and state rules
Use the API contracts in `.agents/contracts/api-contract.md`. Use typed response models that preserve `data_status`, `last_updated`, `source_count`, `coverage_notes`, verification state and provenance. Create a documented API contract change before relying on a missing endpoint. Use server-side pagination/filtering for large datasets. Provide loading, empty, partial, error and unavailable states. Do not use fabricated fallback values in production mode.

## Quality gates
- Public navigation and forms work end-to-end or clearly show an unavailable integration boundary.
- All municipal routes render and use actual API data or visibly labelled isolated demo fixtures.
- No dead buttons, fake login, fake statistics or fabricated operational records.
- Language switching works and persists in all five languages.
- No missing critical translation keys.
- Maps handle missing/approximate coordinates honestly.
- Similarity results expose the evidence and human-review state.
- Images display provenance and distinguish detection confidence from visual similarity.
- Risk scores expose factor contributions and data sufficiency.
- Accessibility includes keyboard navigation, visible focus, labels, contrast and chart summaries.
- Run unit, component, integration, responsive and accessibility tests as available.

## Definition of done
Deliver a cohesive public portal and municipal intelligence dashboard, not just the homepage. All routes, subagent-owned modules, shared components, translations and API integrations must be integrated. Report completed routes, responsible agents/workstreams, APIs used or missing, languages tested, data/demo coverage, tests run and unresolved limitations.
