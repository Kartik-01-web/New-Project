export type UserRole = "DRIVER" | "DISPATCHER" | "SUPERVISOR" | "ADMIN" | "AUDITOR";

export type Permission =
  | "DELIVERY_CREATE"
  | "PACKAGE_EDIT"
  | "CONFLICT_RESOLVE"
  | "MANUAL_OVERRIDE"
  | "OVERRIDE_APPROVE"
  | "RULE_EDIT"
  | "SETTINGS_EDIT"
  | "USER_MANAGE"
  | "AUDIT_VIEW"
  | "INCIDENT_MANAGE"
  | "DEVICE_MANAGE"
  | "DRIVER_MANAGE";

export interface User {
  userId: string;
  organizationId: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions: Permission[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  driverId: string;
  organizationId: string;
  userId?: string;
  name: string;
  phone?: string;
  active: boolean;
  assignedDeviceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  deviceId: string;
  organizationId: string;
  driverId?: string;
  displayName: string;
  platform?: string;
  active: boolean;
  lastSeenAt?: string;
  lastSyncAt?: string;
  pendingSyncCount?: number;
  appVersion?: string;
}
