export interface Package {
  packageId: string;
  organizationId: string;
  externalReference?: string;
  deliveryTypeId: string;
  assignedDriverId?: string;
  priority?: string;
  destination: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  businessMetadata?: Record<string, unknown>;
  currentState: string;
  createdAt: string;
  updatedAt: string;
}

export interface CanonicalPackageState {
  organizationId: string;
  packageId: string;
  currentState: string;
  canonicalEventId?: string;
  deliveryTypeId: string;
  assignedDriverId?: string;
  confidence?: number;
  resolutionStatus: string;
  updatedAt: string;
  updatedByType: "SYSTEM" | "HUMAN";
}
