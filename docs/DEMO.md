# Demo Scenarios

## 1. Duplicate retry
- Same `eventId` submitted twice
- Expected: second write is idempotently ignored (`ALREADY_EXISTS`)

## 2. GPS conflict (high confidence)
- Two DELIVERED events; one with 5 m accuracy, one with 50 m
- Expected: AUTO_RESOLVED selecting the higher-accuracy event

## 3. Low-confidence conflict
- Conflicting events with poor GPS / invalid sequence
- Expected: PENDING_MANUAL_REVIEW

## 4. Human override
- Dispatcher applies CHANGE_STATE with reason
- Expected: canonical state updates, audit entry created, raw events untouched

## 5. Incident
- Raise incident linked to package
- Apply corrective action from incident context
- Expected: full audit chain

## 6. Rule update
- Admin changes high-confidence threshold via UI
- Expected: new revision; future reconciliations use new value; old decisions keep snapshot

## 7. Workflow update
- Admin deactivates an event type
- Expected: soft-deactivated; historical references remain valid
