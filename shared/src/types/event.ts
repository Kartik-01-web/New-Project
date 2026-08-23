export type EventSource = "MOBILE" | "ADMIN" | "IMPORT" | "SYSTEM";

export interface DeliveryEvent {
  eventId: string;
  organizationId: string;
  packageId: string;
  driverId: string;
  deviceId: string;
  eventTypeId: string;
  deliveryTypeId: string;
  eventTimestamp: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracy?: number;
  sequenceNumber?: number;
  createdOffline: boolean;
  syncAttempt: number;
  serverReceivedTimestamp?: string;
  syncedAt?: string;
  source: EventSource;
  createdBy?: string;
}
