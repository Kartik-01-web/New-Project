import { demoMetrics } from "../lib/demoData";

const metrics = [
  { label: "Packages Today", value: demoMetrics.packagesToday },
  { label: "Delivered", value: demoMetrics.delivered, color: "var(--success)" },
  { label: "In Transit", value: demoMetrics.inTransit, color: "var(--primary)" },
  { label: "Failed", value: demoMetrics.failed, color: "var(--danger)" },
  { label: "Offline Devices", value: demoMetrics.offlineDevices, color: "var(--warning)" },
  { label: "Pending Sync", value: demoMetrics.pendingSync },
  { label: "Conflicts", value: demoMetrics.conflicts, color: "var(--warning)" },
  { label: "Auto Resolved", value: demoMetrics.autoResolved, color: "var(--success)" },
  { label: "Manual Reviews", value: demoMetrics.manualReviews, color: "var(--accent)" },
  { label: "Open Incidents", value: demoMetrics.openIncidents, color: "var(--danger)" },
];

export default function Overview() {
  return (
    <div>
      <h1 className="page-title">Operations Overview</h1>
      <div className="metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="label">{m.label}</div>
            <div className="value" style={{ color: m.color || "var(--text)" }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Platform Status</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          EdgeSync is running in demo mode with seeded configuration for{" "}
          <strong>EdgeSync Demo Logistics</strong>. All business rules, delivery types,
          and workflow states are configurable through the Admin screens without code changes.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 8, color: "var(--text-muted)" }}>
            Recent Activity
          </h3>
          <ul style={{ listStyle: "none", fontSize: 13, lineHeight: 1.8 }}>
            <li>• PKG-1001 flagged for manual review (confidence 72%)</li>
            <li>• Auto-resolved PKG-1002 → DELIVERED (94%)</li>
            <li>• Incident INC-101 raised: Driver GPS malfunction</li>
            <li>• DEV-002 pending sync: 4 events</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 8, color: "var(--text-muted)" }}>
            Configuration Snapshot
          </h3>
          <ul style={{ listStyle: "none", fontSize: 13, lineHeight: 1.8 }}>
            <li>• Auto-resolve: Enabled</li>
            <li>• High confidence threshold: 85%</li>
            <li>• Supervisor approval: Off</li>
            <li>• Active delivery types: 7</li>
            <li>• Workflow states: 9</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
