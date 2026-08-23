import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const approveCorrection = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Auth required");
  }

  const { correctionId, decision, reason } = data; // decision: APPROVED | REJECTED
  if (!correctionId || !["APPROVED", "REJECTED"].includes(decision)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid parameters");
  }

  const db = admin.firestore();
  const ref = db.collection("manualCorrections").doc(correctionId);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new functions.https.HttpsError("not-found", "Correction not found");
  }

  const correction = snap.data()!;
  if (correction.approvalStatus !== "PENDING") {
    throw new functions.https.HttpsError("failed-precondition", "Correction is not pending approval");
  }

  const now = new Date().toISOString();
  await ref.update({
    approvalStatus: decision,
    approvedBy: context.auth.uid,
    approvedAt: now,
  });

  if (decision === "APPROVED") {
    // Apply the change
    const canRef = db.collection("canonicalStates").doc(`${correction.organizationId}_${correction.packageId}`);
    const update: any = {
      updatedAt: now,
      updatedByType: "HUMAN",
      resolutionStatus: "MANUALLY_RESOLVED",
    };
    if (correction.correctionType === "CHANGE_STATE") {
      update.currentState = correction.newValue;
    } else if (correction.correctionType === "SELECT_EVENT") {
      update.canonicalEventId = correction.newValue;
    }
    await canRef.set(update, { merge: true });
  }

  await db.collection("auditLogs").add({
    auditId: `AUD-${Date.now()}`,
    organizationId: correction.organizationId,
    entityType: "ManualCorrection",
    entityId: correctionId,
    action: decision === "APPROVED" ? "CORRECTION_APPROVED" : "CORRECTION_REJECTED",
    actorType: "USER",
    actorId: context.auth.uid,
    reason: reason || null,
    createdAt: now,
  });

  return { status: decision, correctionId };
});
