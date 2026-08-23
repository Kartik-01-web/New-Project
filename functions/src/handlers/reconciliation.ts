import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Inline minimal reconciliation for functions (shared package would be linked in real monorepo)
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const runReconciliation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Auth required");
  }

  const { organizationId, packageId, force = false } = data;
  if (!organizationId || !packageId) {
    throw new functions.https.HttpsError("invalid-argument", "organizationId and packageId required");
  }

  const db = admin.firestore();

  // Load settings & rule profile
  const settingsSnap = await db.collection("organizationSettings").doc(organizationId).get();
  const settings = settingsSnap.data() || {
    autoResolveEnabled: true,
    highConfidenceThreshold: 0.85,
    mediumConfidenceThreshold: 0.6,
  };

  const rulesSnap = await db
    .collection("ruleProfiles")
    .where("organizationId", "==", organizationId)
    .where("active", "==", true)
    .limit(1)
    .get();

  const ruleProfile = rulesSnap.empty
    ? {
        ruleProfileId: "DEFAULT",
        scoringWeights: { gpsAccuracy: 0.35, timestamp: 0.25, locationConsistency: 0.25, sequenceConsistency: 0.15 },
        thresholds: { highConfidence: 0.85, mediumConfidence: 0.6 },
        locationToleranceMeters: 100,
        timestampToleranceMinutes: 20,
        resolverVersion: "1.0.0",
      }
    : rulesSnap.docs[0].data();

  // Load events for package
  const eventsSnap = await db
    .collection("deliveryEvents")
    .where("organizationId", "==", organizationId)
    .where("packageId", "==", packageId)
    .get();

  const events = eventsSnap.docs.map((d) => d.data());

  if (events.length === 0) {
    return { status: "NO_EVENTS" };
  }

  // Simple scoring (mirrors shared engine)
  let best = events[0];
  let bestScore = 0;
  const scores: Record<string, number> = {};

  for (const e of events) {
    let score = 0.5;
    if (e.gpsAccuracy != null) {
      score += e.gpsAccuracy <= 10 ? 0.3 : e.gpsAccuracy <= 30 ? 0.15 : 0.05;
    }
    if (e.latitude && e.longitude) score += 0.15;
    scores[e.eventId] = Math.min(1, score);
    if (scores[e.eventId] > bestScore) {
      bestScore = scores[e.eventId];
      best = e;
    }
  }

  const confidence = bestScore;
  let resolutionStatus = "PENDING_MANUAL_REVIEW";
  if (settings.autoResolveEnabled) {
    if (confidence >= (ruleProfile.thresholds?.highConfidence || 0.85)) {
      resolutionStatus = "AUTO_RESOLVED";
    } else if (confidence >= (ruleProfile.thresholds?.mediumConfidence || 0.6)) {
      resolutionStatus = "RESOLVED_WITH_WARNING";
    }
  }

  const decisionId = `DEC-${Date.now()}-${packageId.slice(-6)}`;
  const decision = {
    decisionId,
    organizationId,
    packageId,
    ruleProfileId: ruleProfile.ruleProfileId || "DEFAULT",
    ruleSnapshot: ruleProfile,
    resolverVersion: ruleProfile.resolverVersion || "1.0.0",
    candidateEventIds: events.map((e: any) => e.eventId),
    selectedEventId: best.eventId,
    confidence,
    resolutionStatus,
    explanation: `Selected ${best.eventId} with confidence ${(confidence * 100).toFixed(1)}% using rule ${ruleProfile.ruleProfileId || "DEFAULT"}.`,
    createdAt: new Date().toISOString(),
    createdByType: "SYSTEM",
  };

  await db.collection("reconciliationDecisions").doc(decisionId).set(decision);

  // Update canonical state if auto-resolved
  if (resolutionStatus === "AUTO_RESOLVED" || resolutionStatus === "RESOLVED_WITH_WARNING") {
    await db.collection("canonicalStates").doc(`${organizationId}_${packageId}`).set(
      {
        organizationId,
        packageId,
        currentState: best.eventTypeId || "UNKNOWN",
        canonicalEventId: best.eventId,
        deliveryTypeId: best.deliveryTypeId,
        assignedDriverId: best.driverId,
        confidence,
        resolutionStatus,
        updatedAt: new Date().toISOString(),
        updatedByType: "SYSTEM",
      },
      { merge: true }
    );
  }

  // Audit
  await db.collection("auditLogs").add({
    auditId: `AUD-${Date.now()}`,
    organizationId,
    entityType: "ReconciliationDecision",
    entityId: decisionId,
    action: "RECONCILIATION_RUN",
    actorType: "SYSTEM",
    after: decision,
    createdAt: new Date().toISOString(),
  });

  return decision;
});
