# Admin Guide

## Configure Organization

1. Open **System Settings**
2. Adjust timezone, currency, auto-resolve, thresholds, approval requirements
3. Provide a reason for the change
4. Save — audit entry is created

## Manage Delivery Types

1. Open **Delivery Types**
2. Add / edit / soft-deactivate (set `active = false`)
3. Scoring weights on a type must sum to 1.0

## Manage Workflow States

1. Open **Workflow States**
2. Edit name, order, terminal flag, allowed transitions
3. Soft-deactivate unused states

## Modify Reconciliation Rules

1. Open **Business Rules**
2. Adjust weights (must sum to 1.0) and thresholds
3. Enter change reason
4. Save — creates a new RuleRevision; historical decisions keep old snapshot

## Manage Users

Create accounts in Firebase Authentication, then assign roles (DRIVER / DISPATCHER / SUPERVISOR / ADMIN / AUDITOR) via user records.

## Manual Resolution

1. Go to **Manual Reviews** or open a package
2. Choose action (state change, select event, etc.)
3. Enter mandatory reason
4. If supervisor approval is required, wait for approval

## Raise Incidents

Use **Incidents** → Raise Incident. Link to package/event. All actions are audited.
