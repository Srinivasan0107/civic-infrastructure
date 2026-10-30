# Civic Infrastructure Memory — Agent Bundle

This bundle configures a coding-agent team to build a citizen-facing municipal digital-services portal and multilingual municipal intelligence dashboard with semantic complaint analysis, multimodal image intelligence, recurring incident clustering, explainable maintenance prioritization, and a local MongoDB dataset pipeline.

## What is included

- `AGENTS.md` — product requirements and engineering rules.
- `agents/` — specialist agent profiles for orchestration, public portal UI, municipal dashboard UI, i18n, MongoDB/ETL, semantic matching, geospatial linking, predictive maintenance, image intelligence, backend and QA.
- `prompts/frontend-generation.md` — complete frontend generation prompt for the public portal and municipal intelligence dashboard.
- `workflows/` — repeatable tasks for dashboard build, dataset import, semantic evaluation, prediction readiness, language additions, image intelligence and coordinated public/dashboard frontend generation.
- `contracts/` — MongoDB data model, API response contract and dataset pipeline contract.
- `config/` — baseline stack, language registry and candidate dataset catalogue.

A root-level `AGENTS.md` is also included as a loader for coding agents that discover project instructions from the repository root.

## Use in a project

1. Extract this ZIP into the root of your application repository, preserving the hidden `.agents/` directory.
2. Keep the root `AGENTS.md` and `.agents/` folder at the same level as your `frontend/` and `backend/` folders.
3. Open the project in your coding agent.
4. Start with the prompt in `START_PROMPT.md`.
5. Ask the lead agent to inspect the repository first, then delegate the workstreams to specialist profiles.

## Subagent compatibility

The specialist profiles are platform-neutral Markdown agent specifications. Coding environments differ in how they register native subagents. Where native subagents are supported, register each file in `.agents/agents/` as a specialist. Otherwise, the lead agent must execute the workstreams sequentially using these profiles as bounded instructions. Do not assume that simply placing Markdown files in `.agents/agents/` automatically registers subagents in every tool.

## Local MongoDB

A `docker-compose.mongo.yml` and `.env.example` are included at the ZIP root. Start local MongoDB with:

```bash
docker compose -f docker-compose.mongo.yml up -d
```

Default development connection:

```text
mongodb://127.0.0.1:27017/civic_memory
```

MongoDB is bound to localhost and persists in a named Docker volume. The application should store source files in `dataset_files` GridFS and original photos/thumbnails/defect crops in `media_files` GridFS; raw imported rows in `raw_records`; normalized records, detections, embeddings, visual matches and processing jobs in their canonical collections.

## Critical product rules

- Build a municipal decision-support dashboard, not only a complaint submission portal.
- English, Kannada, Hindi, Tamil and Telugu are required initial UI languages.
- Preserve complaint text in its original language; optional translation is additional metadata.
- Similar text or images are not proof of the same asset/defect. Combine text, visual, spatial, temporal and source-link evidence and require human confirmation for recurrence/asset links.
- Use explainable priority scores until actual labelled maintenance outcomes support validated prediction.
- Keep NYC benchmark data separate from Bengaluru operational data.
- Preserve raw data, provenance, source licence/terms and rejected-row details.
- Do not mix synthetic examples into real metrics or model evaluation.

## Frontend generation with subagents

Run `.agents/workflows/07-build-public-and-municipal-frontend.md` to build both the public portal and the secure municipal dashboard. The public portal specialist owns citizen-facing routes; the dashboard specialist owns `/dashboard/*`; the i18n specialist owns all five locale resources. Semantic, image, geospatial and predictive specialists supply their API/evidence contracts, while QA validates the integrated application. Use `.agents/prompts/frontend-generation.md` as the complete frontend specification.
