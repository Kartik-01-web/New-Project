# EdgeSync Architecture

## Core Principle

```
Raw Events
   ↓
Validation
   ↓
Business Rules
   ↓
Conflict Detection
   ↓
Automated Reconciliation
   ↓
Confidence Check
   ↓
Human Review If Needed
   ↓
Canonical Business State
   ↓
Audit History
```

Raw events are **immutable**. Canonical state is the current business truth. All mutations are explicit, reason-bearing, and audited.

## Organization Model

Every major record carries `organizationId`. This enables future multi-tenancy. MVP simplifies security but keeps the data model ready.

## Dynamic Configuration Layers

1. **Organization** — identity, timezone, currency
2. **BusinessSettings** — auto-resolve flag, thresholds, approval policy, retry limits
3. **DeliveryType** — scoring weights, proof requirements, priority
4. **EventTypeConfig** — ordered states, terminal flags, allowed transitions
5. **ReconciliationRuleProfile** — weights, thresholds, tolerances, version

Configuration is cached on mobile for offline continuity.

## Data Flow (Mobile)

1. Capture action → create immutable local event (with `eventId`)
2. Persist to AsyncStorage queue
3. UI shows success immediately
4. Background / manual sync when NetInfo reports connectivity
5. Cloud Function `ingestDeliveryEvent` writes with document ID = eventId (idempotent)
6. Reconciliation may run (callable or trigger)

## Data Flow (Dashboard / Human)

1. Operator sees pending manual reviews / conflicts / incidents
2. Submits ManualCorrection with mandatory reason
3. If `requireSupervisorApproval` → PENDING → approve/reject
4. On apply: update CanonicalPackageState, write AuditRecord
5. Raw DeliveryEvents remain untouched

## Security

- Firebase Authentication
- Critical mutations via Cloud Functions (settings, corrections, rule changes, canonical updates)
- Firestore rules deny direct client writes to sensitive collections
- Role → Permission mapping enforced on backend

## Collections

- organizations, organizationSettings, users, drivers, devices
- packages, deliveryEvents, canonicalStates
- reconciliationDecisions, manualCorrections, operationalIncidents
- auditLogs, deliveryTypes, eventTypes, ruleProfiles, ruleRevisions
