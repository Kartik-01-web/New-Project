# Testing

## Reconciliation Unit Tests

Located at `shared/src/__tests__/reconciliation.test.ts`.

Coverage:
- Weights validation (sum = 1.0)
- Empty / single candidate
- GPS preference
- Determinism (identical inputs → identical output)
- Threshold-driven status
- Destination proximity

Run (after installing jest):
```bash
cd shared && npx jest
```

## Business Operation Checks (manual / integration)

- Admin can update settings; driver cannot
- Dispatcher can resolve allowed conflicts
- Supervisor approval gate works when enabled
- Manual reason is required
- Invalid state rejected
- Inactive delivery type cannot be assigned
- Audit created for every correction

## Mobile Offline

1. Enable airplane mode
2. Capture multiple events
3. Verify queue grows in Sync Status
4. Restore network → Sync Now → queue drains
5. Re-submit same eventId → no duplicate
