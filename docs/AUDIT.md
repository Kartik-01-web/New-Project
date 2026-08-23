# Audit & Traceability

Every important operation produces an `AuditRecord`:

- Event ingestion
- Duplicate detection (idempotent skip)
- Reconciliation runs
- Auto / manual resolution
- Manual corrections & approvals / rejections
- Package / driver / device changes
- Rule & settings changes
- Incidents & closures

## Principles

1. Raw `DeliveryEvent` documents are never updated or deleted.
2. Canonical state changes are always accompanied by an audit entry.
3. Manual actions require a non-empty reason.
4. Rule changes create versioned snapshots; old decisions keep their snapshot.
5. Auditors have read-only access to the full history.
