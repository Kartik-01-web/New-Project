import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const updateBusinessSettings = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Auth required");
  }

  const { organizationId, settings, reason } = data;
  if (!organizationId || !settings) {
    throw new functions.https.HttpsError("invalid-argument", "Missing data");
  }

  // Validate thresholds
  if (settings.highConfidenceThreshold != null) {
    if (settings.highConfidenceThreshold < 0 || settings.highConfidenceThreshold > 1) {
      throw new functions.https.HttpsError("invalid-argument", "highConfidenceThreshold must be 0-1");
    }
  }

  const db = admin.firestore();
  const ref = db.collection("organizationSettings").doc(organizationId);
  const prev = (await ref.get()).data() || {};

  const updated = {
    ...prev,
    ...settings,
    organizationId,
    updatedBy: context.auth.uid,
    updatedAt: new Date().toISOString(),
  };

  await ref.set(updated, { merge: true });

  await db.collection("auditLogs").add({
    auditId: `AUD-${Date.now()}`,
    organizationId,
    entityType: "BusinessSettings",
    entityId: organizationId,
    action: "SETTINGS_UPDATED",
    actorType: "USER",
    actorId: context.auth.uid,
    before: prev,
    after: updated,
    reason: reason || "Settings update",
    createdAt: new Date().toISOString(),
  });

  return updated;
});
