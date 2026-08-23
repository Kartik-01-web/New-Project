export type ResolutionStatus =
  | "AUTO_RESOLVED"
  | "RESOLVED_WITH_WARNING"
  | "PENDING_MANUAL_REVIEW"
  | "MANUALLY_RESOLVED"
  | "NO_CONFLICT";

export interface ReconciliationDecision {
  decisionId: string;
  organizationId: string;
  packageId: string;
  ruleProfileId: string;
  ruleSnapshot: object;
  resolverVersion: string;
  candidateEventIds: string[];
  selectedEventId?: string;
  confidence: number;
  resolutionStatus: ResolutionStatus;
  explanation: string;
  scores?: {
    gpsAccuracy: number;
    timestamp: number;
    locationConsistency: number;
    sequenceConsistency: number;
  };
  createdAt: string;
  createdByType: "SYSTEM" | "HUMAN";
  createdBy?: string;
}
