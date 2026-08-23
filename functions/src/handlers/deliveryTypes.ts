import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const manageDeliveryType = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Auth required");
  }

  const { action, deliveryType } = data; // action: CREATE | UPDATE | DEACTIVATE
  if (!action || !deliveryType || !deliveryType.organizationId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing data");
  }

  // Validate weights if present
  if (deliveryType.scoringWeights) {
    const w = deliveryType.scoringWeights;
    const sum = (w.gpsAccuracy || 0) + (w.timestamp || 0) + (w.locationConsistency || 0) + (w.sequenceConsistency || 0);
    if (Math.abs(sum - 1) > 0.01) {
      throw new functions.https.HttpsError("invalid-argument", "Scoring weights must sum to 1.0");
    }
  }

  const db = admin.firestore();
  const id = deliveryType.deliveryTypeId || `DT-${Date.now()}`;
  const ref = db.collection("deliveryTypes").doc(id);

  if (action === "DEACTIVATE") {
    await ref.set({ active: false, updatedAt: new Date().toISOString() }, { merge: true });
  } else {
    await ref.set(
      {
        ...deliveryType,
        deliveryTypeId: id,
        active: deliveryType.active !== false,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  await db.collection("auditLogs").add({
    auditId: `AUD-${Date.now()}`,
    organizationId: deliveryType.organizationId,
    entityType: "DeliveryType",
    entityId: id,
    action: `DELIVERY_TYPE_${action}`,
    actorType: "USER",
    actorId: context.auth.uid,
    after: deliveryType,
    createdAt: new Date().toISOString(),
  });

  return { deliveryTypeId: id, status: "OK" };
});
