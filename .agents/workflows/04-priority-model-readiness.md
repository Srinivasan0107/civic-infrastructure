# Workflow: Build and Validate Asset Prioritization

## MVP
1. Define each feature and its source (confirmed complaints, verified inspections, completed work orders, actual outcome).
2. Calculate a transparent priority score from available, verified features.
3. Show contribution and linked evidence for every component.
4. Show `insufficient data` where required inputs are absent.
5. Exclude unconfirmed semantic matches from confirmed recurrence counts.
6. Make weights configurable and versioned.

## Supervised model readiness
Before training, verify that outcome labels describe a future event after a known prediction timestamp. Define the operational prediction horizon with municipal experts. Require adequate sample size and representative asset types/wards.

## Validation
- Use chronological train/validation/test splits.
- Group by asset to prevent the same asset history appearing on both sides where relevant.
- Exclude all post-prediction information from features.
- Report PR-AUC, ROC-AUC, Brier score/calibration, recall at a fixed inspection capacity, and subgroup performance.
- Compare model to simple baselines and the rule-based score.
- Record model version, data snapshot, features, evaluation and known limitations.

## Dashboard language
Use `Inspection priority` or `Priority score` for the MVP. Use `Estimated failure probability` only for a validated and calibrated model, and show horizon and uncertainty.
