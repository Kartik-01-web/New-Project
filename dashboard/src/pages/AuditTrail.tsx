export default function AuditTrail() {
  const entries = [
    { id: "AUD-001", action: "RECONCILIATION_RUN", entity: "PKG-1001", actor: "SYSTEM", time: "2026-08-23T09:15:00Z" },
    { id: "AUD-002", action: "EVENT_INGESTED", entity: "EVT-B", actor: "USER:driver1", time: "2026-08-23T08:52:00Z" },
    { id: "AUD-003", action: "SETTINGS_UPDATED", entity: "org-edgesync-demo", actor: "USER:admin", time: "2026-08-22T14:00:00Z", reason: "Tighten high-confidence threshold for pilot" },
    { id: "AUD-004", action: "CORRECTION_APPLIED", entity: "COR-001", actor: "USER:dispatcher1", time: "2026-08-22T11:30:00Z", reason: "Customer confirmed delivery by phone" },
  ];

  return (
    <div>
      <h1 className="page-title">Audit Trail</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 14 }}>
        Immutable history of all important business operations. Raw evidence is never destroyed.
      </p>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Audit ID</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Actor</th>
              <th>Reason</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.action}</td>
                <td>{e.entity}</td>
                <td>{e.actor}</td>
                <td style={{ fontSize: 13 }}>{e.reason || "—"}</td>
                <td style={{ fontSize: 12 }}>{new Date(e.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
