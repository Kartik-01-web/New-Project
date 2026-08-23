# EdgeSync — Dynamic Business Operations & Human-in-the-Loop Platform

**Offline-First Dynamic Logistics Operations and Intelligent Reconciliation Platform**

EdgeSync is a configurable, multi-organization-ready platform that transforms unreliable edge-device data into trustworthy operational state while keeping humans in control whenever reality falls outside automated rules.

## Product Vision

- Offline delivery operations (12+ hours without network)
- Dynamic business configuration (no code changes for new orgs)
- Event reconciliation with configurable scoring
- Human-in-the-loop controls, approvals, and incidents
- Full audit history
- Role-based access control

## Architecture

```
Raw Events → Validation → Business Rules → Conflict Detection
    → Automated Reconciliation → Confidence Check
    → Human Review If Needed → Canonical Business State → Audit History
```

**Never destroy raw operational evidence.**

## Technology Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Mobile       | React Native + Expo + TypeScript |
| Dashboard    | React + Vite + TypeScript     |
| Backend      | Firebase Cloud Functions (TS) |
| Database     | Cloud Firestore               |
| Auth         | Firebase Authentication       |
| Shared       | TypeScript types + pure engine|

## Monorepo Structure

```
edgesync/
├── mobile/          # Expo React Native driver app
├── dashboard/       # React operational + admin dashboard
├── functions/       # Firebase Cloud Functions
├── shared/          # Shared types, constants, reconciliation engine
├── docs/            # Architecture, guides, testing
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 20+
- Firebase CLI (`npm i -g firebase-tools`)
- Expo CLI (for mobile)

### 1. Shared package
```bash
cd shared && npm install
```

### 2. Cloud Functions
```bash
cd functions && npm install
# For emulator:
export FIRESTORE_EMULATOR_HOST=localhost:8080
npx ts-node src/seed/seed.ts
```

### 3. Dashboard
```bash
cd dashboard && npm install && npm run dev
# Open http://localhost:5173
```

### 4. Mobile
```bash
cd mobile && npm install && npx expo start
```

### 5. Firebase Emulators
```bash
firebase emulators:start
```

## Dynamic Configuration (No Code Changes)

Admins configure via the dashboard:

- **Organization** — name, timezone, currency
- **Business Settings** — auto-resolve, thresholds, approval requirements
- **Delivery Types** — STANDARD, PERISHABLE, MEDICINE, HIGH_VALUE, FRAGILE, EXPRESS, COLD_CHAIN (+ custom)
- **Workflow States** — ASSIGNED → … → DELIVERED / FAILED / RETURNED / CANCELLED
- **Reconciliation Rules** — scoring weights (must sum to 1.0), confidence thresholds, tolerances
- **Users & Roles** — DRIVER, DISPATCHER, SUPERVISOR, ADMIN, AUDITOR

All changes create audit records and (for rules) versioned snapshots so historical decisions remain explainable.

## Reconciliation Engine

Pure deterministic function in `shared/src/engine/reconciliation.ts`:

- GPS accuracy normalization
- Timestamp proximity
- Location consistency / destination proximity
- Sequence / transition validity
- Configurable weights & thresholds

Same inputs + same config → same result. No randomness. No generative AI for core decisions.

## Offline Mobile Flow

1. Driver captures event (GPS + state)
2. Immutable local event created immediately
3. Queued in AsyncStorage (idempotent by `eventId`)
4. Sync when network available with exponential retry
5. Backend rejects duplicates; never creates double events

## Human-in-the-Loop

- **Manual Review Center** — low confidence, conflicts, anomalies
- **Manual Corrections** — require reason; optional supervisor approval
- **Incidents** — structured handling of unexpected real-world cases
- All human actions audited; raw events never overwritten

## Demo Organization

Seeded as **EdgeSync Demo Logistics** (`org-edgesync-demo`).

Demo accounts (create via Firebase Auth):
- admin@demo
- dispatcher@demo
- supervisor@demo
- auditor@demo

## Documentation

See `docs/` folder for ARCHITECTURE, RECONCILIATION, ADMIN_GUIDE, OPERATIONS_GUIDE, AUDIT, DEMO, TESTING.

## Non-Negotiable Rules

1. Never destroy raw delivery evidence
2. Never hardcode business configuration that should be editable
3. Never allow manual changes without audit history
4. Never let client UI alone determine permission
5. Never use retry as a new event
6. Never make auto-resolution mandatory
7. Never force automation when confidence is low
8. Never silently change historical decisions after rule updates
9. Never require developers for routine business operations
10. Every important business operation must be traceable
