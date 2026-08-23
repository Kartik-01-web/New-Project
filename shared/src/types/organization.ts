export interface Organization {
  organizationId: string;
  name: string;
  code: string;
  timezone: string;
  currency: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  organizationId: string;
  autoResolveEnabled: boolean;
  highConfidenceThreshold: number;
  mediumConfidenceThreshold: number;
  maxGpsAccuracyMeters: number;
  maxRetryCount: number;
  maxRetryDelaySeconds: number;
  requireOverrideReason: boolean;
  requireSupervisorApproval: boolean;
  allowedManualStates: string[];
  defaultDeliveryType: string;
  updatedBy: string;
  updatedAt: string;
}
