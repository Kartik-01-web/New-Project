export interface ReconciliationRuleProfile {
  ruleProfileId: string;
  organizationId: string;
  name: string;
  active: boolean;
  applicableDeliveryTypes: string[];
  scoringWeights: {
    gpsAccuracy: number;
    timestamp: number;
    locationConsistency: number;
    sequenceConsistency: number;
  };
  thresholds: {
    highConfidence: number;
    mediumConfidence: number;
  };
  locationToleranceMeters: number;
  timestampToleranceMinutes: number;
  resolverVersion: string;
  updatedBy: string;
  updatedAt: string;
}

export interface RuleRevision {
  revisionId: string;
  ruleProfileId: string;
  version: number;
  snapshot: object;
  changedBy: string;
  changedAt: string;
  changeReason: string;
}
