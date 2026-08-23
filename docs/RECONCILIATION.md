# Reconciliation Engine

## Location

`shared/src/engine/reconciliation.ts` — pure, deterministic, no side effects.

## Scoring Factors

| Factor                 | Description                                      |
|------------------------|--------------------------------------------------|
| GPS Accuracy           | Lower meters → higher score                      |
| Timestamp              | Closer to reference within tolerance → higher    |
| Location Consistency   | Proximity to expected destination or cluster     |
| Sequence Consistency   | Valid transition from current canonical state    |

Weights are loaded from the active `ReconciliationRuleProfile` and normalized to sum to 1.

## Confidence Thresholds

- `>= highConfidenceThreshold` → AUTO_RESOLVED (if autoResolveEnabled)
- `>= mediumConfidenceThreshold` → RESOLVED_WITH_WARNING
- `< medium` → PENDING_MANUAL_REVIEW

## Safe Rule Changes

Each decision stores:
- `ruleProfileId`
- `ruleSnapshot`
- `resolverVersion`

Future rule edits only affect new runs. Historical decisions remain explainable.

## Re-run

"Re-run Reconciliation" creates a **new** decision document. Old decisions are never overwritten.
