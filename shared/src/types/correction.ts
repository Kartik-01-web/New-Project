export type ApprovalStatus = "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED";

export type CorrectionType =
  | "SELECT_EVENT"
  | "CHANGE_STATE"
  | "CHANGE_DRIVER"
  | "CHANGE_DELIVERY_TYPE"
  | "CHANGE_DESTINATION"
  | "MARK_INVALID_EVENT"
  | "REOPEN_PACKAGE"
  | "FORCE_RECONCILIATION"
  | "CANCEL_DELIVERY"
  | "ADD_CORRECTIVE_EVENT";

export interface ManualCorrection {
  correctionId: string;
  organizationId: string;
  packageId: string;
  correctionType: CorrectionType;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  createdBy: string;
  createdAt: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  incidentId?: string;
}
