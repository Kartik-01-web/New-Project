import { useState } from "react";
import { demoSettings } from "../lib/demoData";

export default function BusinessRules() {
  const [weights, setWeights] = useState({
    gpsAccuracy: 0.35,
    timestamp: 0.25,
    locationConsistency: 0.25,
    sequenceConsistency: 0.15,
  });
  const [high, setHigh] = useState(demoSettings.highConfidenceThreshold);
  const [medium, setMedium] = useState(demoSettings.mediumConfidenceThreshold);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  const sum = Object.values(weights).reduce((a, b) => a + b, 0);

  const save = () => {
    if (Math.abs(sum - 1) > 0.001) {
      setMsg("Weights must sum to 1.0");
      return;
    }
    if (reason.trim().length < 5) {
      setMsg("Reason for change is required.");
      return;
    }
    setMsg("Rule profile updated. New revision created. Historical decisions retain previous snapshots.");
  };

  return (
    <div>
      <h1 className="page-title">Reconciliation Rules</h1>
      <div className="card" style={{ maxWidth: 520 }}>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>Scoring Weights (must sum to 1.0)</h3>
        {Object.entries(weights).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <label style={{ width: 160, fontSize: 13 }}>{k}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={v}
              onChange={(e) => setWeights({ ...weights, [k]: parseFloat(e.target.value) || 0 })}
              style={{ width: 80 }}
            />
          </div>
        ))}
        <p style={{ fontSize: 13, color: Math.abs(sum - 1) < 0.001 ? "var(--success)" : "var(--danger)" }}>
          Sum: {sum.toFixed(3)}
        </p>

        <h3 style={{ fontSize: 14, margin: "16px 0 12px" }}>Confidence Thresholds</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>
            High (≥ auto-resolve)
            <input type="number" step="0.01" value={high} onChange={(e) => setHigh(parseFloat(e.target.value))} style={{ display: "block", width: 80, marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 13 }}>
            Medium (≥ warning)
            <input type="number" step="0.01" value={medium} onChange={(e) => setMedium(parseFloat(e.target.value))} style={{ display: "block", width: 80, marginTop: 4 }} />
          </label>
        </div>

        <textarea
          placeholder="Reason for this change (required)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <button className="btn btn-primary" onClick={save}>Save Rule Profile</button>
        {msg && <p style={{ marginTop: 12, color: "var(--success)", fontSize: 13 }}>{msg}</p>}
      </div>
    </div>
  );
}
