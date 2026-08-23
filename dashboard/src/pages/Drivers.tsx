import { demoDrivers } from "../lib/demoData";

export default function Drivers() {
  return (
    <div>
      <h1 className="page-title">Drivers</h1>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Device</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoDrivers.map((d) => (
              <tr key={d.driverId}>
                <td>{d.driverId}</td>
                <td>{d.name}</td>
                <td>{d.phone}</td>
                <td>{d.assignedDeviceId}</td>
                <td>
                  <span className={d.active ? "badge badge-success" : "badge badge-danger"}>
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
