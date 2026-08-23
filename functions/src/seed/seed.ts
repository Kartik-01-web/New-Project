/**
 * Seed script for EdgeSync Demo Logistics organization.
 * Run with: npx ts-node src/seed/seed.ts (requires Firebase Admin credentials)
 * For emulator: set FIRESTORE_EMULATOR_HOST=localhost:8080
 */

import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({ projectId: "edgesync-demo" });
}

const db = admin.firestore();

const ORG_ID = "org-edgesync-demo";

async function seed() {
  console.log("Seeding EdgeSync Demo...");

  // Organization
  await db.collection("organizations").doc(ORG_ID).set({
    organizationId: ORG_ID,
    name: "EdgeSync Demo Logistics",
    code: "ESDEMO",
    timezone: "Asia/Kolkata",
    currency: "INR",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Settings
  await db.collection("organizationSettings").doc(ORG_ID).set({
    organizationId: ORG_ID,
    autoResolveEnabled: true,
    highConfidenceThreshold: 0.85,
    mediumConfidenceThreshold: 0.6,
    maxGpsAccuracyMeters: 100,
    maxRetryCount: 5,
    maxRetryDelaySeconds: 300,
    requireOverrideReason: true,
    requireSupervisorApproval: false,
    allowedManualStates: ["DELIVERED", "DELIVERY_FAILED", "RETURNED", "CANCELLED"],
    defaultDeliveryType: "STANDARD",
    updatedBy: "system",
    updatedAt: new Date().toISOString(),
  });

  // Delivery Types
  const deliveryTypes = [
    { code: "STANDARD", name: "Standard" },
    { code: "PERISHABLE", name: "Perishable" },
    { code: "MEDICINE", name: "Medicine" },
    { code: "HIGH_VALUE", name: "High Value" },
    { code: "FRAGILE", name: "Fragile" },
    { code: "EXPRESS", name: "Express" },
    { code: "COLD_CHAIN", name: "Cold Chain" },
  ];

  for (const dt of deliveryTypes) {
    const id = `DT-${dt.code}`;
    await db.collection("deliveryTypes").doc(id).set({
      deliveryTypeId: id,
      organizationId: ORG_ID,
      name: dt.name,
      code: dt.code,
      active: true,
      scoringWeights: {
        gpsAccuracy: 0.35,
        timestamp: 0.25,
        locationConsistency: 0.25,
        sequenceConsistency: 0.15,
      },
      rules: {
        requiresProof: dt.code === "HIGH_VALUE" || dt.code === "MEDICINE",
        requiresGps: true,
        priority: dt.code === "EXPRESS" ? "HIGH" : "NORMAL",
      },
    });
  }

  // Event Types
  const eventTypes = [
    { code: "ASSIGNED", name: "Assigned", order: 1, isTerminal: false, allowedPreviousStates: [], allowedNextStates: ["PICKED_UP", "CANCELLED"] },
    { code: "PICKED_UP", name: "Picked Up", order: 2, isTerminal: false, allowedPreviousStates: ["ASSIGNED"], allowedNextStates: ["IN_TRANSIT", "RETURNED"] },
    { code: "IN_TRANSIT", name: "In Transit", order: 3, isTerminal: false, allowedPreviousStates: ["PICKED_UP"], allowedNextStates: ["OUT_FOR_DELIVERY", "RETURNED"] },
    { code: "OUT_FOR_DELIVERY", name: "Out for Delivery", order: 4, isTerminal: false, allowedPreviousStates: ["IN_TRANSIT"], allowedNextStates: ["DELIVERED", "DELIVERY_FAILED"] },
    { code: "DELIVERED", name: "Delivered", order: 5, isTerminal: true, allowedPreviousStates: ["OUT_FOR_DELIVERY"], allowedNextStates: [] },
    { code: "DELIVERY_FAILED", name: "Delivery Failed", order: 6, isTerminal: true, allowedPreviousStates: ["OUT_FOR_DELIVERY"], allowedNextStates: ["RETURNED"] },
    { code: "RETURNED", name: "Returned", order: 7, isTerminal: true, allowedPreviousStates: ["PICKED_UP", "IN_TRANSIT", "DELIVERY_FAILED"], allowedNextStates: [] },
    { code: "CANCELLED", name: "Cancelled", order: 8, isTerminal: true, allowedPreviousStates: ["ASSIGNED"], allowedNextStates: [] },
    { code: "MANUAL_CORRECTION", name: "Manual Correction", order: 99, isTerminal: false, allowedPreviousStates: [], allowedNextStates: [] },
  ];

  for (const et of eventTypes) {
    const id = `ET-${et.code}`;
    await db.collection("eventTypes").doc(id).set({
      eventTypeId: id,
      organizationId: ORG_ID,
      ...et,
      active: true,
    });
  }

  // Rule Profile
  await db.collection("ruleProfiles").doc("RP-DEFAULT").set({
    ruleProfileId: "RP-DEFAULT",
    organizationId: ORG_ID,
    name: "Default Reconciliation Profile",
    active: true,
    applicableDeliveryTypes: deliveryTypes.map((d) => `DT-${d.code}`),
    scoringWeights: {
      gpsAccuracy: 0.35,
      timestamp: 0.25,
      locationConsistency: 0.25,
      sequenceConsistency: 0.15,
    },
    thresholds: {
      highConfidence: 0.85,
      mediumConfidence: 0.6,
    },
    locationToleranceMeters: 100,
    timestampToleranceMinutes: 20,
    resolverVersion: "1.0.0",
    updatedBy: "system",
    updatedAt: new Date().toISOString(),
  });

  // Demo drivers & devices
  await db.collection("drivers").doc("DRV-001").set({
    driverId: "DRV-001",
    organizationId: ORG_ID,
    name: "Ravi Kumar",
    phone: "+919876543210",
    active: true,
    assignedDeviceId: "DEV-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await db.collection("devices").doc("DEV-001").set({
    deviceId: "DEV-001",
    organizationId: ORG_ID,
    driverId: "DRV-001",
    displayName: "Ravi's Android",
    platform: "android",
    active: true,
    appVersion: "1.0.0",
  });

  // Demo packages
  const packages = [
    { id: "PKG-1001", state: "OUT_FOR_DELIVERY", type: "DT-STANDARD" },
    { id: "PKG-1002", state: "DELIVERED", type: "DT-PERISHABLE" },
    { id: "PKG-1003", state: "IN_TRANSIT", type: "DT-MEDICINE" },
  ];

  for (const p of packages) {
    await db.collection("packages").doc(p.id).set({
      packageId: p.id,
      organizationId: ORG_ID,
      externalReference: `REF-${p.id}`,
      deliveryTypeId: p.type,
      assignedDriverId: "DRV-001",
      priority: "NORMAL",
      destination: {
        address: "123 MG Road, Bengaluru",
        latitude: 12.9716,
        longitude: 77.5946,
      },
      businessMetadata: {
        customerName: "Demo Customer",
        invoiceNumber: `INV-${p.id}`,
      },
      currentState: p.state,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.collection("canonicalStates").doc(`${ORG_ID}_${p.id}`).set({
      organizationId: ORG_ID,
      packageId: p.id,
      currentState: p.state,
      deliveryTypeId: p.type,
      assignedDriverId: "DRV-001",
      confidence: 0.95,
      resolutionStatus: "AUTO_RESOLVED",
      updatedAt: new Date().toISOString(),
      updatedByType: "SYSTEM",
    });
  }

  console.log("Seed complete for organization:", ORG_ID);
}

seed().catch(console.error);
