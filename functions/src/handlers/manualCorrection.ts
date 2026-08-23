import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const applyManualCorrection = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Auth required");
  }

  const {
    organizationId,
    packageId,
    correctionType,
    previousValue,
    newValue,
    reason,
    incidentId,
  } = data;

  if (!organizationId || !packageId || !correctionType || !reason) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields (reason is mandatory)");
  }

  if (String(reason).trim().length < 5) {
    throw new functions.https.HttpsError("invalid-argument", "Reason must be at least 5 characters");
  }

  const db = admin.firestore();

  // Load settings for approval requirement
  const settingsSnap = await db.collection("organizationSettings").doc(organizationId).get();
  const settings = settingsSnap.data() || { requireSupervisorApproval: false };

  const correctionId = `COR-${Date.now()}`;
  const now = new Date().toISOString();

  const correction = {
    correctionId,
    organizationId,
    packageId,
    correctionType,
    previousValue: previousValue ?? null,
    newValue: newValue ?? null,
    reason: String(reason).trim(),
    createdBy: context.auth.uid,
    createdAt: now,
    approvalStatus: settings.requireSupervisorApproval ? "PENDING" : "NOT_REQUIRED",
    incidentId: incidentId || null,
  };

  await db.collection("manualCorrections").doc(correctionId).set(correction);

  // If no approval needed, apply immediately
  if (!settings.requireSupervisorApproval) {
    await applyCorrectionToCanonical(db, organizationId, packageId, correctionType, newValue, context.auth.uid);
  }

  await db.collection("auditLogs").add({
    auditId: `AUD-${Date.now()}`,
    organizationId,
    entityType: "ManualCorrection",
    entityId: correctionId,
    action: settings.requireSupervisorApproval ? "CORRECTION_SUBMITTED" : "CORRECTION_APPLIED",
    actorType: "USER",
    actorId: context.auth.uid,
    before: previousValue,
    after: newValue,
    reason,
    createdAt: now,
  });

  return correction;
});

async function applyCorrectionToCanonical(
  db: FirebaseFirestore.Firestore,
  organizationId: string,
  packageId: string,
  correctionType: string,
  newValue: any,
  actorId: string
) {
  const ref = db.collection("canonicalStates").doc(`${organizationId}_${packageId}`);
  const update: any = {
    updatedAt: new Date().toISOString(),
    updatedByType: "HUMAN",
  };

  if (correctionType === "CHANGE_STATE") {
    update.currentState = newValue;
    update.resolutionStatus = "MANUALLY_RESOLVED";
  } else if (correctionType === "CHANGE_DRIVER") {
    update.assignedDriverId = newValue;
  } else if (correctionType === "SELECT_EVENT") {
    update.canonicalEventId = newValue;
    update.resolutionStatus = "MANUALLY_RESOLVED";
  } else if (correctionType === "CANCEL_DELIVERY") {
    update.currentState = "CANCELLED";
    update.resolutionStatus = "MANUALLY_RESOLVED";
  }

  await ref.set(update, { merge: true });
}
