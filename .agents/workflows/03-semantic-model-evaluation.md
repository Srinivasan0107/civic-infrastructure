# Workflow: Evaluate Multilingual Semantic Complaint Analysis

## Dataset preparation
Create a labelled set of complaint pairs with labels:
- `same_asset_same_incident`;
- `same_asset_recurring_incident`;
- `related_but_not_same_asset`;
- `different_asset_same_category`;
- `unrelated`;
- `insufficient_location_evidence`.

Include English, Kannada, Hindi, Tamil and Telugu; report retrieval quality separately per language. Have qualified reviewers check translated/annotated content. Preserve original texts and avoid exposing personal identifiers.

## Evaluation protocol
- Split by asset and time so near-duplicate complaints from the same asset do not leak across train/test.
- Report top-k retrieval precision/recall and pair classification precision/recall/F1.
- Report per-language results and cross-language pairs separately.
- Inspect false positives at distant locations and false negatives with paraphrased wording.
- Calibrate text thresholds on local labelled data; do not pick a threshold based on intuition alone.
- Validate cluster coherence with human-reviewed cluster samples.

## Release condition
Semantic search may launch as candidate discovery before it is highly accurate, but automatic asset merging remains disabled. Show candidate confidence and evidence; collect reviewer decisions for future evaluation.
