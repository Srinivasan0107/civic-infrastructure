# Workflow 07 — Build the Public Portal and Municipal Intelligence Frontend

## Goal
Build the complete Civic Infrastructure Memory frontend: a public multilingual municipal portal plus a role-aware municipal intelligence dashboard. Follow `.agents/prompts/frontend-generation.md` exactly alongside the master requirements and API contracts.

## Orchestrator: mandatory delegation
Use native subagents when supported. Assign bounded tasks and require each to report changed files, routes, API dependencies, tests, demo-data usage and unresolved issues. Do not claim delegation if no native subagent execution occurred.

### Workstream A — Public portal
Delegate to `public-portal-frontend-engineer`.
Owns: `/`, `/services`, `/services/:serviceId`, `/about`, `/announcements`, `/report`, `/citizen/complaints`, `/citizen/complaints/:complaintId`, public header/footer and citizen-facing forms.
Deliver: responsive homepage, service discovery, announcements, consent-aware complaint submission UI, public data states and accessibility.

### Workstream B — Municipal dashboard shell and views
Delegate to `dashboard-frontend-engineer`.
Owns: `/dashboard` and all `/dashboard/*` routes, sidebar/topbar, shared dashboard components, asset timeline, tables, charts, filters and API hooks.
Deliver: command center, asset explorer/detail, maintenance, reports, data pipeline and data quality views; integrate semantic/image/predictive endpoints without implementing duplicate model logic.

### Workstream C — Multilingual UX
Delegate to `multilingual-i18n-engineer`.
Owns locale configuration, dictionaries, selector, formatting helpers, typography and language QA across public and municipal routes.
Required initial locales: `en`, `kn`, `hi`, `ta`, `te`.
Deliver complete key parity for every visible string. Work with both frontend agents; do not overwrite their page components.

### Workstream D — AI feature contracts and view integration
- `semantic-analysis-engineer`: provide typed semantic-search/review payloads, evidence fields and example API fixtures; coordinate with dashboard agent for semantic UI integration.
- `image-intelligence-engineer`: provide media, detection, embedding and visual-match contracts; coordinate image timeline/comparison UI.
- `predictive-maintenance-engineer`: provide score/tier/factor/data-sufficiency contracts; coordinate risk views.
- `geospatial-asset-engineer`: provide GeoJSON/map/filter contracts and missing-coordinate semantics; coordinate map UI.
These agents own the backend/model evidence and contract correctness, not independent competing dashboard page implementations.

### Workstream E — Data and API integration
`mongodb-data-engineer` and `fastapi-backend-engineer` validate that the frontend endpoints expose the required data, provenance, status and pagination. They own backend/schema changes; frontend agents consume agreed API types. MongoDB remains backend-only and local-first.

### Workstream F — Quality and release verification
`qa-evaluation-engineer` owns integrated tests for public and dashboard routes, role boundaries, five locales, accessibility, responsive layouts, semantic review, visual review, predictive explanation, API error/partial states and demo-data separation.

## Shared integration contracts
Before parallel work begins, the orchestrator must publish or confirm:
1. Route map and ownership boundaries.
2. Design tokens, fonts, spacing, button/card/table/chart patterns.
3. Shared header, locale selector, alert/announcement and footer contracts.
4. API response types from `.agents/contracts/api-contract.md`.
5. Auth/role assumptions and protected route behavior.
6. Demo-data namespace and visible DEMO labeling.

Do not allow parallel agents to edit the same shared files. The orchestrator owns route registration, app bootstrap, shared tokens and final integration unless explicitly delegated with a clean file boundary.

## Implementation sequence
1. Inspect repository, current frontend stack, routes, auth and API client. Report findings before edits.
2. Confirm API contracts and shared design system.
3. Build shared app foundation: theme tokens, typography, route guards, API client, query cache, i18n provider, layout primitives and error boundaries.
4. In parallel, build public portal and municipal dashboard route groups using agreed shared components.
5. Integrate semantic, image, geospatial and predictive endpoints and evidence states.
6. Add complete English, Kannada, Hindi, Tamil and Telugu dictionaries and verify public/dashboard strings.
7. Connect MongoDB-backed API data pipeline and job states. Never connect the browser directly to MongoDB.
8. Integrate routes and verify all navigation, filters, upload flows, timeline drilldowns, map interactions and review actions.
9. Run tests/build/lint/accessibility and responsive checks. Remove misleading placeholders and isolate demo fixtures.
10. Update project README with frontend setup, routes, environment variables, API dependencies, locale support and test commands.

## Acceptance criteria
- Public homepage has all required sections, functional links and truthful API-backed statistics.
- Public reporting flow has validation, consent, upload/location states and clear API unavailable/error states.
- Municipal dashboard includes overview, map, asset registry/detail timeline, semantic analysis, image intelligence, recurring incidents, predictive prioritization, maintenance, reports, data pipeline and data quality.
- Every dashboard page shows loading, empty, error, partial and data freshness/coverage states as applicable.
- UI supports English, Kannada, Hindi, Tamil and Telugu; preference persists across routes and reloads.
- No visible hardcoded English strings remain outside locale resources, except immutable identifiers and content intentionally preserved from source records.
- Original complaint text is preserved; translations are labelled.
- Semantic and image matches remain candidates until authorized human review.
- Priority score is not represented as calibrated failure probability.
- Actual recorded expenditure only; missing data stays unknown.
- Demo records and metrics are visually labelled and never mixed into live totals.
- User roles are enforced by real backend authorization; frontend route guards are additional UX only.
- No dead buttons or fake authentication.
- Tests include route smoke tests, locale key parity, form states, API error handling, evidence rendering and accessibility checks.

## Final report
Report: routes delivered, owner/subagent workstreams, shared files changed, APIs consumed/added, supported languages and verification status, demo data used, tests/build results, accessibility checks and remaining blockers.
