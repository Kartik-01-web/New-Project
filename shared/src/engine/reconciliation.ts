/**
 * Pure deterministic reconciliation engine.
 * No side effects, no randomness, no external dependencies beyond pure math.
 */

export interface CandidateEvent {
  eventId: string;
  eventTypeCode: string;
  eventTimestamp: string; // ISO
  latitude?: number;
  longitude?: number;
  gpsAccuracy?: number; // meters
  sequenceNumber?: number;
  source: string;
}

export interface ScoringWeights {
  gpsAccuracy: number;
  timestamp: number;
  locationConsistency: number;
  sequenceConsistency: number;
}

export interface ReconciliationConfig {
  scoringWeights: ScoringWeights;
  highConfidenceThreshold: number;
  mediumConfidenceThreshold: number;
  locationToleranceMeters: number;
  timestampToleranceMinutes: number;
  expectedDestination?: { latitude: number; longitude: number };
  allowedTransitions?: Record<string, string[]>; // previous -> next[]
  currentCanonicalState?: string;
}

export interface ScoreBreakdown {
  gpsAccuracy: number;
  timestamp: number;
  locationConsistency: number;
  sequenceConsistency: number;
  total: number;
}

export interface ReconciliationResult {
  selectedEventId: string | null;
  confidence: number;
  resolutionStatus: "AUTO_RESOLVED" | "RESOLVED_WITH_WARNING" | "PENDING_MANUAL_REVIEW" | "NO_CONFLICT";
  explanation: string;
  scores: Record<string, ScoreBreakdown>;
  candidateCount: number;
}

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function normalizeGpsScore(accuracyMeters?: number, maxAccuracy = 100): number {
  if (accuracyMeters == null || accuracyMeters < 0) return 0.3;
  if (accuracyMeters <= 5) return 1.0;
  if (accuracyMeters >= maxAccuracy) return 0.1;
  return 1 - (accuracyMeters - 5) / (maxAccuracy - 5) * 0.9;
}

function scoreTimestamp(
  eventTs: string,
  referenceTs: string,
  toleranceMinutes: number
): number {
  const eventMs = new Date(eventTs).getTime();
  const refMs = new Date(referenceTs).getTime();
  if (isNaN(eventMs) || isNaN(refMs)) return 0.2;
  const diffMinutes = Math.abs(eventMs - refMs) / 60000;
  if (diffMinutes <= toleranceMinutes / 2) return 1.0;
  if (diffMinutes >= toleranceMinutes) return 0.1;
  return 1 - ((diffMinutes - toleranceMinutes / 2) / (toleranceMinutes / 2)) * 0.9;
}

function scoreLocation(
  lat?: number,
  lon?: number,
  expected?: { latitude: number; longitude: number },
  toleranceMeters = 100,
  candidates?: CandidateEvent[]
): number {
  if (lat == null || lon == null) return 0.2;

  if (expected) {
    const dist = haversineMeters(lat, lon, expected.latitude, expected.longitude);
    if (dist <= toleranceMeters / 2) return 1.0;
    if (dist >= toleranceMeters * 2) return 0.1;
    return 1 - (dist - toleranceMeters / 2) / (toleranceMeters * 1.5) * 0.9;
  }

  // Cluster consistency: average distance to other candidates with location
  if (candidates && candidates.length > 1) {
    const others = candidates.filter(
      (c) => c.latitude != null && c.longitude != null && (c.latitude !== lat || c.longitude !== lon)
    );
    if (others.length === 0) return 0.7;
    const avgDist =
      others.reduce(
        (sum, c) => sum + haversineMeters(lat, lon, c.latitude!, c.longitude!),
        0
      ) / others.length;
    if (avgDist <= 20) return 1.0;
    if (avgDist >= 200) return 0.2;
    return 1 - (avgDist - 20) / 180 * 0.8;
  }

  return 0.6;
}

function scoreSequence(
  eventTypeCode: string,
  currentState?: string,
  allowedTransitions?: Record<string, string[]>
): number {
  if (!allowedTransitions || !currentState) return 0.7;
  const allowed = allowedTransitions[currentState] || [];
  if (allowed.includes(eventTypeCode)) return 1.0;
  if (eventTypeCode === currentState) return 0.5; // duplicate state
  return 0.15; // invalid transition
}

export function reconcileEvents(
  candidates: CandidateEvent[],
  config: ReconciliationConfig,
  referenceTimestamp?: string
): ReconciliationResult {
  if (candidates.length === 0) {
    return {
      selectedEventId: null,
      confidence: 0,
      resolutionStatus: "NO_CONFLICT",
      explanation: "No candidate events to reconcile.",
      scores: {},
      candidateCount: 0,
    };
  }

  if (candidates.length === 1) {
    const only = candidates[0];
    return {
      selectedEventId: only.eventId,
      confidence: 1.0,
      resolutionStatus: "AUTO_RESOLVED",
      explanation: `Single event ${only.eventId} accepted with full confidence.`,
      scores: {
        [only.eventId]: {
          gpsAccuracy: 1,
          timestamp: 1,
          locationConsistency: 1,
          sequenceConsistency: 1,
          total: 1,
        },
      },
      candidateCount: 1,
    };
  }

  const weights = config.scoringWeights;
  const weightSum =
    weights.gpsAccuracy +
    weights.timestamp +
    weights.locationConsistency +
    weights.sequenceConsistency;

  // Normalize weights if they don't sum to ~1
  const norm = weightSum > 0 ? weightSum : 1;
  const w = {
    gpsAccuracy: weights.gpsAccuracy / norm,
    timestamp: weights.timestamp / norm,
    locationConsistency: weights.locationConsistency / norm,
    sequenceConsistency: weights.sequenceConsistency / norm,
  };

  const refTs =
    referenceTimestamp ||
    candidates.reduce((latest, c) =>
      new Date(c.eventTimestamp) > new Date(latest) ? c.eventTimestamp : latest,
    candidates[0].eventTimestamp);

  const scores: Record<string, ScoreBreakdown> = {};
  let bestId: string | null = null;
  let bestScore = -1;

  for (const c of candidates) {
    const gps = normalizeGpsScore(c.gpsAccuracy, 100);
    const ts = scoreTimestamp(c.eventTimestamp, refTs, config.timestampToleranceMinutes);
    const loc = scoreLocation(
      c.latitude,
      c.longitude,
      config.expectedDestination,
      config.locationToleranceMeters,
      candidates
    );
    const seq = scoreSequence(
      c.eventTypeCode,
      config.currentCanonicalState,
      config.allowedTransitions
    );

    const total =
      gps * w.gpsAccuracy +
      ts * w.timestamp +
      loc * w.locationConsistency +
      seq * w.sequenceConsistency;

    scores[c.eventId] = {
      gpsAccuracy: Math.round(gps * 1000) / 1000,
      timestamp: Math.round(ts * 1000) / 1000,
      locationConsistency: Math.round(loc * 1000) / 1000,
      sequenceConsistency: Math.round(seq * 1000) / 1000,
      total: Math.round(total * 1000) / 1000,
    };

    if (total > bestScore) {
      bestScore = total;
      bestId = c.eventId;
    }
  }

  const confidence = Math.round(bestScore * 1000) / 1000;
  let resolutionStatus: ReconciliationResult["resolutionStatus"];

  if (confidence >= config.highConfidenceThreshold) {
    resolutionStatus = "AUTO_RESOLVED";
  } else if (confidence >= config.mediumConfidenceThreshold) {
    resolutionStatus = "RESOLVED_WITH_WARNING";
  } else {
    resolutionStatus = "PENDING_MANUAL_REVIEW";
  }

  // Build deterministic explanation
  const selected = candidates.find((c) => c.eventId === bestId)!;
  const s = scores[bestId!];
  const explanation = [
    `Selected event ${bestId} (type: ${selected.eventTypeCode}).`,
    `GPS: ${selected.gpsAccuracy != null ? selected.gpsAccuracy + "m accuracy" : "no GPS"}, score ${s.gpsAccuracy}.`,
    `Timestamp: ${selected.eventTimestamp}, score ${s.timestamp}.`,
    `Location consistency score: ${s.locationConsistency}.`,
    `Sequence validity score: ${s.sequenceConsistency}.`,
    `Final confidence: ${(confidence * 100).toFixed(1)}%.`,
    `Status: ${resolutionStatus}.`,
  ].join(" ");

  return {
    selectedEventId: bestId,
    confidence,
    resolutionStatus,
    explanation,
    scores,
    candidateCount: candidates.length,
  };
}

export function validateWeights(weights: ScoringWeights): boolean {
  const sum =
    weights.gpsAccuracy +
    weights.timestamp +
    weights.locationConsistency +
    weights.sequenceConsistency;
  return Math.abs(sum - 1.0) < 0.001;
}
