export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";

export interface OperationalIncident {
  incidentId: string;
  organizationId: string;
  packageId?: string;
  eventId?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
}
