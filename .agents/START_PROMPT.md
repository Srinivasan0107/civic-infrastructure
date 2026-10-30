# Start Prompt for the Coding Agent

Read the root `AGENTS.md`, `.agents/AGENTS.md`, `.agents/agents/orchestrator.md`, `.agents/prompts/frontend-generation.md` and `.agents/workflows/07-build-public-and-municipal-frontend.md` completely before implementation.

You are building Civic Infrastructure Memory: a citizen-facing multilingual municipal services portal plus a secure municipal intelligence dashboard. Inspect the existing repository, frontend/backend stack, API routes, authentication and local MongoDB setup before changing files. Preserve working conventions and follow `.agents/contracts/`.

## Required subagent delegation
Use native subagents if supported:
- `public-portal-frontend-engineer`: public homepage, services, about, announcements and citizen reporting routes.
- `dashboard-frontend-engineer`: municipal dashboard shell, overview, maps, assets, semantic/image/predictive views, maintenance, reports and pipeline UI.
- `multilingual-i18n-engineer`: complete English, Kannada, Hindi, Tamil and Telugu dictionaries, selector and locale QA.
- `mongodb-data-engineer` and `fastapi-backend-engineer`: local MongoDB/GridFS data and API contracts/integration.
- `semantic-analysis-engineer`: multilingual complaint matching and review evidence.
- `image-intelligence-engineer`: photo storage, YOLO road-damage detection, DINOv2 embeddings and visual recurrence candidates.
- `geospatial-asset-engineer`: stable asset IDs, GeoJSON, maps and spatial linking.
- `predictive-maintenance-engineer`: explainable priority score, evidence and data sufficiency.
- `qa-evaluation-engineer`: integration, accessibility, five-locale and end-to-end testing.

If native subagents are unavailable, execute the same bounded workstreams sequentially and report the limitation honestly. Do not claim subagents ran when they did not.

## Product requirements
1. Link complaints, photographs, dates, locations, stable asset IDs, inspections and maintenance actions into searchable asset timelines.
2. Provide a public portal and a distinct municipal operations dashboard; do not stop at a landing page or complaint form.
3. Provide semantic multilingual complaint search using Multilingual E5 and evidence-based candidate matching.
4. Provide image intelligence using YOLO detection and DINOv2 visual embeddings, with historical comparisons and human review.
5. Cluster recurring incidents using semantic, visual, spatial and temporal evidence.
6. Provide explainable asset prioritization; never label unvalidated scores as failure probabilities.
7. Support English, Kannada, Hindi, Tamil and Telugu throughout all visible UI strings.
8. Store the dataset pipeline locally in MongoDB; source files and photos must use separate GridFS buckets, raw rows remain preserved, normalized data uses canonical collections and jobs/rejections/checkpoints are persisted.
9. Start MongoDB using `docker-compose.mongo.yml` and persist data with its named volume.
10. Preserve provenance, source terms/licences, data-quality flags and original language. Never invent repair history, costs, photos, coordinates or outcomes.

## Execution
First return a brief repository assessment and phased subagent plan. Establish shared route ownership, design tokens and API contracts before parallel frontend work. Follow Workflow 07 to build the public portal and dashboard in coordinated workstreams. Then implement vertical slices end-to-end, connect every data-driven page to backend APIs, isolate labelled demo fixtures, run tests and report implemented routes, subagent/workstream outcomes, languages verified, API gaps and known dataset limitations.
