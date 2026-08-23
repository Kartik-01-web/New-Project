export const DEFAULT_SCORING_WEIGHTS = {
  gpsAccuracy: 0.35,
  timestamp: 0.25,
  locationConsistency: 0.25,
  sequenceConsistency: 0.15,
};

export const DEFAULT_THRESHOLDS = {
  highConfidence: 0.85,
  mediumConfidence: 0.6,
};

export const DEFAULT_EVENT_TYPES = [
  { code: "ASSIGNED", name: "Assigned", order: 1, isTerminal: false },
  { code: "PICKED_UP", name: "Picked Up", order: 2, isTerminal: false },
  { code: "IN_TRANSIT", name: "In Transit", order: 3, isTerminal: false },
  { code: "OUT_FOR_DELIVERY", name: "Out for Delivery", order: 4, isTerminal: false },
  { code: "DELIVERED", name: "Delivered", order: 5, isTerminal: true },
  { code: "DELIVERY_FAILED", name: "Delivery Failed", order: 6, isTerminal: true },
  { code: "RETURNED", name: "Returned", order: 7, isTerminal: true },
  { code: "CANCELLED", name: "Cancelled", order: 8, isTerminal: true },
  { code: "MANUAL_CORRECTION", name: "Manual Correction", order: 99, isTerminal: false },
];

export const DEFAULT_DELIVERY_TYPES = [
  { code: "STANDARD", name: "Standard" },
  { code: "PERISHABLE", name: "Perishable" },
  { code: "MEDICINE", name: "Medicine" },
  { code: "HIGH_VALUE", name: "High Value" },
  { code: "FRAGILE", name: "Fragile" },
  { code: "EXPRESS", name: "Express" },
  { code: "COLD_CHAIN", name: "Cold Chain" },
];
