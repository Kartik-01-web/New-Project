import { Permission, UserRole } from "../types/user";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  DRIVER: ["DELIVERY_CREATE"],
  DISPATCHER: [
    "DELIVERY_CREATE",
    "PACKAGE_EDIT",
    "CONFLICT_RESOLVE",
    "MANUAL_OVERRIDE",
    "INCIDENT_MANAGE",
    "DRIVER_MANAGE",
  ],
  SUPERVISOR: [
    "DELIVERY_CREATE",
    "PACKAGE_EDIT",
    "CONFLICT_RESOLVE",
    "MANUAL_OVERRIDE",
    "OVERRIDE_APPROVE",
    "INCIDENT_MANAGE",
    "DRIVER_MANAGE",
    "DEVICE_MANAGE",
    "AUDIT_VIEW",
  ],
  ADMIN: [
    "DELIVERY_CREATE",
    "PACKAGE_EDIT",
    "CONFLICT_RESOLVE",
    "MANUAL_OVERRIDE",
    "OVERRIDE_APPROVE",
    "RULE_EDIT",
    "SETTINGS_EDIT",
    "USER_MANAGE",
    "AUDIT_VIEW",
    "INCIDENT_MANAGE",
    "DEVICE_MANAGE",
    "DRIVER_MANAGE",
  ],
  AUDITOR: ["AUDIT_VIEW"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
