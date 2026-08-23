# Operations Guide (Dispatcher / Supervisor)

## Conflict requires manual review

1. Open Manual Review Center or Conflicts list
2. Inspect candidate events, GPS, timestamps, explanation
3. Either select the correct event or apply a state correction with reason
4. Optionally raise an incident

## GPS data is incorrect

- Do not edit raw events
- Raise incident describing the hardware issue
- Apply ManualCorrection (e.g. CHANGE_STATE or SELECT_EVENT) with reason "Driver GPS hardware malfunctioned"

## Driver submitted wrong delivery

- Mark the erroneous event invalid via correction type MARK_INVALID_EVENT
- Or add a MANUAL_CORRECTION event
- Update canonical state with reason

## Package has wrong state

- Use Manual State Update on the package detail screen
- Reason is mandatory
- If approval is enabled, supervisor must approve

## Device is malfunctioning

- Deactivate the device in Devices admin
- Reassign driver to another device if available

## Delivery at unexpected location

- Location scoring will lower confidence automatically
- Review in Manual Review Center
- Accept or override with business confirmation reason

## Driver changed devices

- Update Device → Driver assignment
- Future events will carry the new deviceId

## Package should be reopened

- Correction type REOPEN_PACKAGE
- Choose a non-terminal state
- Requires reason and appropriate role
