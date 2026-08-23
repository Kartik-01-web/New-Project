import { demoDevices } from "../lib/demoData";

export default function Devices() {
  return (
    <div>
      <h1 className="page-title">Devices</h1>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Name</th>
              <th>Platform</th>
              <th>Last Sync</th>
              <th>Pending</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoDevices.map((d) => (
              <tr key={d.deviceId}>
                <td>{d.deviceId}</td>
                <td>{d.displayName}</td>
                <td>{d.platform}</td>
                <td style={{ fontSize: 12 }}>{d.lastSyncAt ? new Date(d.lastSyncAt).toLocaleString() : "—"}</td>
                <td>{d.pendingSyncCount}</td>
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
