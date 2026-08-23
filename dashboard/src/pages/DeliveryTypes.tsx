import { demoDeliveryTypes } from "../lib/demoData";

export default function DeliveryTypes() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Delivery Types</h1>
        <button className="btn btn-primary">+ Add Type</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demoDeliveryTypes.map((dt) => (
              <tr key={dt.deliveryTypeId}>
                <td>{dt.deliveryTypeId}</td>
                <td>{dt.code}</td>
                <td>{dt.name}</td>
                <td>
                  <span className={dt.active ? "badge badge-success" : "badge badge-danger"}>
                    {dt.active ? "Active" : "Inactive"}
                  </span>
                </td>
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
