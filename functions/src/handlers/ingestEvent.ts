import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid"; // will use simple id if no uuid

const db = admin.firestore();

/**
 * Idempotent event ingestion.
 * Uses eventId as document ID so retries are safe.
 */
export const ingestDeliveryEvent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }

  const {
    eventId,
    organizationId,
    packageId,
    driverId,
    deviceId,
    eventTypeId,
    deliveryTypeId,
    eventTimestamp,
    latitude,
    longitude,
    gpsAccuracy,
    sequenceNumber,
    createdOffline,
    source = "MOBILE",
  } = data;

  if (!eventId || !organizationId || !packageId || !eventTypeId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  const eventRef = db.collection("deliveryEvents").doc(eventId);
  const existing = await eventRef.get();

  if (existing.exists) {
    // Idempotent: already ingested
    return { status: "ALREADY_EXISTS", eventId };
  }

  const now = new Date().toISOString();
  const event = {
    eventId,
    organizationId,
    packageId,
    driverId: driverId || "",
    deviceId: deviceId || "",
    eventTypeId,
    deliveryTypeId: deliveryTypeId || "",
    eventTimestamp: eventTimestamp || now,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    gpsAccuracy: gpsAccuracy ?? null,
    sequenceNumber: sequenceNumber ?? null,
    createdOffline: !!createdOffline,
    syncAttempt: 1,
    serverReceivedTimestamp: now,
    syncedAt: now,
    source,
    createdBy: context.auth.uid,
  };

  await eventRef.set(event);

  // Write audit
  await db.collection("auditLogs").add({
    auditId: `AUD-${Date.now()}`,
    organizationId,
    entityType: "DeliveryEvent",
    entityId: eventId,
    action: "EVENT_INGESTED",
    actorType: "USER",
    actorId: context.auth.uid,
    after: event,
    createdAt: now,
  });

  // Trigger reconciliation asynchronously (simplified: call inline for MVP)
  // In production use a pubsub or onWrite trigger

  return { status: "CREATED", eventId };
});
