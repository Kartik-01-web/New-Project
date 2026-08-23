import {
  reconcileEvents,
  validateWeights,
  CandidateEvent,
  ReconciliationConfig,
} from "../engine/reconciliation";
import { DEFAULT_SCORING_WEIGHTS, DEFAULT_THRESHOLDS } from "../constants/defaults";

const baseConfig: ReconciliationConfig = {
  scoringWeights: DEFAULT_SCORING_WEIGHTS,
  highConfidenceThreshold: DEFAULT_THRESHOLDS.highConfidence,
  mediumConfidenceThreshold: DEFAULT_THRESHOLDS.mediumConfidence,
  locationToleranceMeters: 100,
  timestampToleranceMinutes: 20,
};

describe("validateWeights", () => {
  it("accepts weights that sum to 1.0", () => {
    expect(validateWeights(DEFAULT_SCORING_WEIGHTS)).toBe(true);
  });

  it("rejects weights that do not sum to 1.0", () => {
    expect(
      validateWeights({
        gpsAccuracy: 0.5,
        timestamp: 0.5,
        locationConsistency: 0.5,
        sequenceConsistency: 0.5,
      })
    ).toBe(false);
  });
});

describe("reconcileEvents", () => {
  it("returns NO_CONFLICT for empty candidates", () => {
    const result = reconcileEvents([], baseConfig);
    expect(result.resolutionStatus).toBe("NO_CONFLICT");
    expect(result.selectedEventId).toBeNull();
  });

  it("auto-resolves single candidate with full confidence", () => {
    const candidates: CandidateEvent[] = [
      {
        eventId: "EVT-1",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:00:00Z",
        latitude: 12.97,
        longitude: 77.59,
        gpsAccuracy: 8,
        source: "MOBILE",
      },
    ];
    const result = reconcileEvents(candidates, baseConfig);
    expect(result.selectedEventId).toBe("EVT-1");
    expect(result.confidence).toBe(1);
    expect(result.resolutionStatus).toBe("AUTO_RESOLVED");
  });

  it("selects better GPS accuracy event", () => {
    const candidates: CandidateEvent[] = [
      {
        eventId: "EVT-A",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:00:00Z",
        latitude: 12.97,
        longitude: 77.59,
        gpsAccuracy: 50,
        source: "MOBILE",
      },
      {
        eventId: "EVT-B",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:01:00Z",
        latitude: 12.9701,
        longitude: 77.5901,
        gpsAccuracy: 5,
        source: "MOBILE",
      },
    ];
    const result = reconcileEvents(candidates, baseConfig);
    expect(result.selectedEventId).toBe("EVT-B");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("produces identical results for identical inputs (deterministic)", () => {
    const candidates: CandidateEvent[] = [
      {
        eventId: "EVT-1",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:00:00Z",
        latitude: 12.97,
        longitude: 77.59,
        gpsAccuracy: 12,
        source: "MOBILE",
      },
      {
        eventId: "EVT-2",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:05:00Z",
        latitude: 12.98,
        longitude: 77.60,
        gpsAccuracy: 30,
        source: "MOBILE",
      },
    ];
    const r1 = reconcileEvents(candidates, baseConfig);
    const r2 = reconcileEvents(candidates, baseConfig);
    expect(r1).toEqual(r2);
  });

  it("uses configured thresholds for status", () => {
    const lowConfConfig: ReconciliationConfig = {
      ...baseConfig,
      highConfidenceThreshold: 0.99,
      mediumConfidenceThreshold: 0.95,
    };
    const candidates: CandidateEvent[] = [
      {
        eventId: "EVT-A",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:00:00Z",
        latitude: 12.97,
        longitude: 77.59,
        gpsAccuracy: 40,
        source: "MOBILE",
      },
      {
        eventId: "EVT-B",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:30:00Z",
        latitude: 13.0,
        longitude: 78.0,
        gpsAccuracy: 80,
        source: "MOBILE",
      },
    ];
    const result = reconcileEvents(candidates, lowConfConfig);
    // With strict thresholds, should land in PENDING_MANUAL_REVIEW or RESOLVED_WITH_WARNING
    expect(["PENDING_MANUAL_REVIEW", "RESOLVED_WITH_WARNING"]).toContain(
      result.resolutionStatus
    );
  });

  it("respects expected destination for location scoring", () => {
    const configWithDest: ReconciliationConfig = {
      ...baseConfig,
      expectedDestination: { latitude: 12.97, longitude: 77.59 },
    };
    const candidates: CandidateEvent[] = [
      {
        eventId: "NEAR",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:00:00Z",
        latitude: 12.9702,
        longitude: 77.5902,
        gpsAccuracy: 10,
        source: "MOBILE",
      },
      {
        eventId: "FAR",
        eventTypeCode: "DELIVERED",
        eventTimestamp: "2026-08-23T10:00:00Z",
        latitude: 13.5,
        longitude: 78.5,
        gpsAccuracy: 5,
        source: "MOBILE",
      },
    ];
    const result = reconcileEvents(candidates, configWithDest);
    expect(result.selectedEventId).toBe("NEAR");
  });
});
