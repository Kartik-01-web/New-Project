import { Link } from "react-router-dom";
import { demoConflicts } from "../lib/demoData";

export default function ManualReview() {
  return (
    <div>
      <h1 className="page-title">Manual Review Center</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: 14 }}>
        Unresolved conflicts, low-confidence decisions, validation failures, and operator-raised incidents requiring human intervention.
      </p>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>Pending Reviews</h3>
        {demoConflicts.map((c) => (
          <div
            key={c.decisionId}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Link to={`/packages/${c.packageId}`} style={{ fontWeight: 600 }}>
                {c.packageId}
              </Link>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                {c.explanation}
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Confidence: {(c.confidence * 100).toFixed(0)}% · {c.decisionId}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary">Resolve</button>
              <button className="btn btn-ghost">Raise Incident</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
