export interface DeliveryType {
  deliveryTypeId: string;
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  scoringWeights: {
    gpsAccuracy: number;
    timestamp: number;
    locationConsistency: number;
    sequenceConsistency: number;
  };
  rules?: {
    maxDeliveryDelayMinutes?: number;
    requiresProof?: boolean;
    priority?: string;
    requiresGps?: boolean;
    requiresRecipientName?: boolean;
  };
}

export interface EventTypeConfig {
  eventTypeId: string;
  organizationId: string;
  code: string;
  name: string;
  order: number;
  isTerminal: boolean;
  active: boolean;
  allowedPreviousStates: string[];
  allowedNextStates: string[];
}
