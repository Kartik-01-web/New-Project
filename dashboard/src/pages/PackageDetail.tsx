import { useParams, Link } from "react-router-dom";
import { demoPackages } from "../lib/demoData";
import { useState } from "react";

export default function PackageDetail() {
  const { id } = useParams();
  const pkg = demoPackages.find((p) => p.packageId === id) || demoPackages[0];
  const [reason, setReason] = useState("");
  const [newState, setNewState] = useState("DELIVERED");
  const [showCorrection, setShowCorrection] = useState(false);
  const [message, setMessage] = useState("");

  const handleCorrection = () => {
    if (reason.trim().length < 5) {
      setMessage("Reason is required (min 5 characters).");
      return;
    }
    setMessage(`Correction submitted: state → ${newState}. Reason recorded. Audit entry created.`);
    setShowCorrection(false);
    setReason("");
  };

  return (
    <div>
      <Link to="/packages" style={{ fontSize: 13, color: "var(--text-muted)" }}>
        ← Back to Packages
      </Link>
      <h1 className="page-title" style={{ marginTop: 8 }}>
        {pkg.packageId}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-muted)" }}>Package Information</h3>
          <dl style={{ fontSize: 13, lineHeight: 2 }}>
            <div><strong>State:</strong> {pkg.currentState}</div>
            <div><strong>Delivery Type:</strong> {pkg.deliveryTypeId}</div>
            <div><strong>Driver:</strong> {pkg.assignedDriverId}</div>
            <div><strong>Priority:</strong> {pkg.priority}</div>
            <div><strong>Destination:</strong> {pkg.destination.address}</div>
            <div><strong>Confidence:</strong> {((pkg.confidence || 0) * 100).toFixed(0)}%</div>
            <div><strong>Resolution:</strong> {pkg.resolutionStatus}</div>
          </dl>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-muted)" }}>Authorized Actions</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setShowCorrection(true)}>
              Manual State Update
            </button>
            <button className="btn btn-ghost">Change Driver</button>
            <button className="btn btn-ghost">Resolve Conflict</button>
            <button className="btn btn-ghost">Raise Incident</button>
            <button className="btn btn-ghost">Re-run Reconciliation</button>
            <button className="btn btn-danger">Cancel Package</button>
          </div>
          {message && (
            <p style={{ marginTop: 12, color: "var(--success)", fontSize: 13 }}>{message}</p>
          )}
        </div>
      </div>

      {showCorrection && (
        <div className="card" style={{ marginBottom: 20, borderColor: "var(--primary)" }}>
          <h3 style={{ marginBottom: 12 }}>Manual State Update</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <select value={newState} onChange={(e) => setNewState(e.target.value)}>
              <option value="DELIVERED">DELIVERED</option>
              <option value="DELIVERY_FAILED">DELIVERY_FAILED</option>
              <option value="RETURNED">RETURNED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            </select>
          </div>
          <textarea
            placeholder="Reason for correction (required)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handleCorrection}>
              Apply Correction
            </button>
            <button className="btn btn-ghost" onClick={() => setShowCorrection(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-muted)" }}>Event & Decision History</h3>
        <ul style={{ fontSize: 13, lineHeight: 1.9, listStyle: "none" }}>
          <li>09:15 — Reconciliation decision DEC-001 → PENDING_MANUAL_REVIEW (72%)</li>
          <li>08:50 — Event EVT-A: OUT_FOR_DELIVERY (GPS 8m)</li>
          <li>08:52 — Event EVT-B: DELIVERED (GPS 45m) — conflicting</li>
          <li>07:30 — Event: IN_TRANSIT</li>
          <li>06:15 — Event: PICKED_UP</li>
        </ul>
        <p style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 12 }}>
          Raw events are immutable. Manual corrections create new audit records and never overwrite evidence.
        </p>
      </div>
    </div>
  );
}
