const states = [
  { code: "ASSIGNED", name: "Assigned", order: 1, terminal: false },
  { code: "PICKED_UP", name: "Picked Up", order: 2, terminal: false },
  { code: "IN_TRANSIT", name: "In Transit", order: 3, terminal: false },
  { code: "OUT_FOR_DELIVERY", name: "Out for Delivery", order: 4, terminal: false },
  { code: "DELIVERED", name: "Delivered", order: 5, terminal: true },
  { code: "DELIVERY_FAILED", name: "Delivery Failed", order: 6, terminal: true },
  { code: "RETURNED", name: "Returned", order: 7, terminal: true },
  { code: "CANCELLED", name: "Cancelled", order: 8, terminal: true },
  { code: "MANUAL_CORRECTION", name: "Manual Correction", order: 99, terminal: false },
];

export default function WorkflowConfig() {
  return (
    <div>
      <h1 className="page-title">Workflow States</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 14 }}>
        Configure event types and allowed transitions. Soft-deactivate rather than delete to preserve history.
      </p>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Code</th>
              <th>Name</th>
              <th>Terminal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.map((s) => (
              <tr key={s.code}>
                <td>{s.order}</td>
                <td>{s.code}</td>
                <td>{s.name}</td>
                <td>{s.terminal ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: 12 }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
