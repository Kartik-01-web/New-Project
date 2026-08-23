export type ActorType = "SYSTEM" | "USER";

export interface AuditRecord {
  auditId: string;
  organizationId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorType: ActorType;
  actorId?: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
