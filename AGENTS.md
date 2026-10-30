# Project Agent Entry Point

This repository is an AI-assisted Civic Infrastructure Memory and Recurring Failure Intelligence dashboard.

Before making changes, read:
1. `.agents/AGENTS.md` — non-negotiable project requirements.
2. `.agents/agents/orchestrator.md` — coordination and delegation rules.
3. The relevant specialist agent profiles under `.agents/agents/`.
4. Relevant contracts under `.agents/contracts/` before changing schemas or APIs.

For full frontend generation, follow `.agents/workflows/07-build-public-and-municipal-frontend.md` and `.agents/prompts/frontend-generation.md`; delegate public routes to `public-portal-frontend-engineer`, dashboard routes to `dashboard-frontend-engineer`, and all locale resources to `multilingual-i18n-engineer`. Use the specialist profiles as subagents when the coding environment supports subagents. If it does not, the lead agent must execute the same workstreams sequentially and preserve each specialist's deliverables. Do not claim that a subagent ran if the environment did not actually run one.

The product is a municipal decision-support system, not merely a citizen complaint registration portal. It must provide searchable asset histories, multilingual semantic complaint analysis, image intelligence, recurring incident clustering, explainable maintenance prioritization, a citizen-facing public portal, and a local MongoDB dataset pipeline. The initial UI languages are English, Kannada, Hindi, Tamil and Telugu.

Image analysis is mandatory: use `.agents/agents/image-intelligence-engineer.md` and `.agents/contracts/data-model.md` for GridFS media storage, YOLO road-damage detection, DINOv2 embeddings, visual recurrence candidates and human-reviewed photo evidence.
