# Workflow: Build the Municipal Operations Dashboard

## Goal
Deliver the integrated municipal dashboard, including asset memory, semantic analysis, recurring incidents, prioritization, multilingual controls and data pipeline monitoring.

## Steps
1. Inspect the repository and document existing frontend/backend conventions.
2. Read master instructions and contracts. Confirm MongoDB local setup before implementing screens.
3. Build shared app shell: navigation, role-aware header, global filters, locale switcher, responsive layout, loading/error/empty states.
4. Build Overview page using real API aggregates and coverage metadata.
5. Build Asset Explorer and asset timeline with linked complaints, images, inspections and maintenance events.
6. Build map page with assets, incidents, cluster overlays, map filters and no-coordinate states.
7. Build Semantic Analysis page with language-aware search, evidence breakdown and human review actions.
8. Build Recurring Incidents page with cluster review and recurrence summaries.
9. Build Predictive Prioritization page with explanation panels, data-sufficiency labels and evidence drilldown.
10. Build Maintenance Analytics page; show actual cost only when recorded.
11. Build Data Pipeline page with upload, import jobs, stage counters, rejected rows and source metadata.
12. Add English/Kannada/Hindi/Tamil/Telugu dictionaries and verify every critical workflow. Follow `.agents/workflows/07-build-public-and-municipal-frontend.md` for coordinated public-portal and dashboard generation.
13. Test real API integration; remove all fake/demo-only data paths from production mode.
14. Run tests, accessibility checks and responsive checks; document unresolved gaps.

## Final report
List routes implemented, API dependencies, actual data coverage, languages verified, tests run, and any feature that remains blocked by unavailable municipal records.
