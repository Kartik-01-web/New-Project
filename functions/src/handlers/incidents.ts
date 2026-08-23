import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const raiseIncident = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Auth required");
  }

  const { organizationId, packageId, eventId, title, description, severity = "MEDIUM" } = data;
  if (!organizationId || !title || !description) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  const incidentId = `INC-${Date.now()}`;
  const now = new Date().toISOString();
  const incident = {
    incidentId,
    organizationId,
    packageId: packageId || null,
    eventId: eventId || null,
    title,
    description,
    severity,
    status: "OPEN",
    createdBy: context.auth.uid,
    createdAt: now,
  };

  const db = admin.firestore();
  await db.collection("operationalIncidents").doc(incidentId).set(incident);

  await db.collection("auditLogs").add({
    auditId: `AUD-${Date.now()}`,
    organizationId,
    entityType: "OperationalIncident",
    entityId: incidentId,
    action: "INCIDENT_RAISED",
    actorType: "USER",
    actorId: context.auth.uid,
    after: incident,
    createdAt: now,
  });

  return incident;
});
