export const ORG_ID = "org-edgesync-demo";

export const demoMetrics = {
  packagesToday: 48,
  delivered: 31,
  inTransit: 9,
  failed: 3,
  offlineDevices: 1,
  pendingSync: 12,
  conflicts: 4,
  autoResolved: 22,
  manualReviews: 3,
  openIncidents: 2,
  criticalIncidents: 0,
};

export const demoPackages = [
  {
    packageId: "PKG-1001",
    externalReference: "REF-PKG-1001",
    currentState: "OUT_FOR_DELIVERY",
    deliveryTypeId: "DT-STANDARD",
    assignedDriverId: "DRV-001",
    priority: "NORMAL",
    destination: { address: "123 MG Road, Bengaluru", latitude: 12.9716, longitude: 77.5946 },
    confidence: 0.72,
    resolutionStatus: "PENDING_MANUAL_REVIEW",
  },
  {
    packageId: "PKG-1002",
    externalReference: "REF-PKG-1002",
    currentState: "DELIVERED",
    deliveryTypeId: "DT-PERISHABLE",
    assignedDriverId: "DRV-001",
    priority: "HIGH",
    destination: { address: "45 Indiranagar, Bengaluru", latitude: 12.9784, longitude: 77.6408 },
    confidence: 0.94,
    resolutionStatus: "AUTO_RESOLVED",
  },
  {
    packageId: "PKG-1003",
    externalReference: "REF-PKG-1003",
    currentState: "IN_TRANSIT",
    deliveryTypeId: "DT-MEDICINE",
    assignedDriverId: "DRV-001",
    priority: "HIGH",
    destination: { address: "78 Koramangala, Bengaluru", latitude: 12.9352, longitude: 77.6245 },
    confidence: 0.88,
    resolutionStatus: "AUTO_RESOLVED",
  },
  {
    packageId: "PKG-1004",
    externalReference: "REF-PKG-1004",
    currentState: "DELIVERY_FAILED",
    deliveryTypeId: "DT-FRAGILE",
    assignedDriverId: "DRV-002",
    priority: "NORMAL",
    destination: { address: "12 Whitefield, Bengaluru", latitude: 12.9698, longitude: 77.7499 },
    confidence: 0.55,
    resolutionStatus: "PENDING_MANUAL_REVIEW",
  },
];

export const demoConflicts = [
  {
    decisionId: "DEC-001",
    packageId: "PKG-1001",
    confidence: 0.72,
    resolutionStatus: "PENDING_MANUAL_REVIEW",
    explanation: "Two DELIVERED events with similar timestamps; GPS accuracy differs significantly.",
    createdAt: "2026-08-23T09:15:00Z",
  },
  {
    decisionId: "DEC-002",
    packageId: "PKG-1004",
    confidence: 0.55,
    resolutionStatus: "PENDING_MANUAL_REVIEW",
    explanation: "Invalid state transition detected; low sequence consistency.",
    createdAt: "2026-08-23T08:40:00Z",
  },
];

export const demoIncidents = [
  {
    incidentId: "INC-101",
    packageId: "PKG-1001",
    title: "Driver GPS malfunction",
    description: "Driver reported phone GPS stuck; multiple conflicting coordinates submitted.",
    severity: "HIGH",
    status: "OPEN",
    createdAt: "2026-08-23T09:20:00Z",
  },
  {
    incidentId: "INC-102",
    packageId: "PKG-1004",
    title: "Customer claimed non-delivery",
    description: "Customer called warehouse claiming package never arrived; driver marked failed.",
    severity: "MEDIUM",
    status: "INVESTIGATING",
    createdAt: "2026-08-23T08:55:00Z",
  },
];

export const demoDrivers = [
  { driverId: "DRV-001", name: "Ravi Kumar", phone: "+919876543210", active: true, assignedDeviceId: "DEV-001" },
  { driverId: "DRV-002", name: "Priya Sharma", phone: "+919876543211", active: true, assignedDeviceId: "DEV-002" },
];

export const demoDevices = [
  { deviceId: "DEV-001", displayName: "Ravi's Android", platform: "android", active: true, lastSyncAt: "2026-08-23T09:10:00Z", pendingSyncCount: 0 },
  { deviceId: "DEV-002", displayName: "Priya's iPhone", platform: "ios", active: true, lastSyncAt: "2026-08-23T07:30:00Z", pendingSyncCount: 4 },
];

export const demoDeliveryTypes = [
  { deliveryTypeId: "DT-STANDARD", code: "STANDARD", name: "Standard", active: true },
  { deliveryTypeId: "DT-PERISHABLE", code: "PERISHABLE", name: "Perishable", active: true },
  { deliveryTypeId: "DT-MEDICINE", code: "MEDICINE", name: "Medicine", active: true },
  { deliveryTypeId: "DT-HIGH_VALUE", code: "HIGH_VALUE", name: "High Value", active: true },
  { deliveryTypeId: "DT-FRAGILE", code: "FRAGILE", name: "Fragile", active: true },
  { deliveryTypeId: "DT-EXPRESS", code: "EXPRESS", name: "Express", active: true },
  { deliveryTypeId: "DT-COLD_CHAIN", code: "COLD_CHAIN", name: "Cold Chain", active: true },
];

export const demoSettings = {
  autoResolveEnabled: true,
  highConfidenceThreshold: 0.85,
  mediumConfidenceThreshold: 0.6,
  maxGpsAccuracyMeters: 100,
  requireOverrideReason: true,
  requireSupervisorApproval: false,
  defaultDeliveryType: "STANDARD",
};
