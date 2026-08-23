import { Link } from "react-router-dom";
import { demoPackages } from "../lib/demoData";

function statusBadge(status: string) {
  if (status === "AUTO_RESOLVED") return "badge badge-success";
  if (status === "PENDING_MANUAL_REVIEW") return "badge badge-warning";
  return "badge badge-info";
}

export default function Packages() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Packages</h1>
        <button className="btn btn-primary">+ Create Package</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Package ID</th>
              <th>Reference</th>
              <th>State</th>
              <th>Type</th>
              <th>Driver</th>
              <th>Confidence</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {demoPackages.map((p) => (
              <tr key={p.packageId}>
                <td>
                  <Link to={`/packages/${p.packageId}`}>{p.packageId}</Link>
                </td>
                <td>{p.externalReference}</td>
                <td>{p.currentState}</td>
                <td>{p.deliveryTypeId.replace("DT-", "")}</td>
                <td>{p.assignedDriverId}</td>
                <td>{((p.confidence || 0) * 100).toFixed(0)}%</td>
                <td>
                  <span className={statusBadge(p.resolutionStatus || "")}>
                    {p.resolutionStatus?.replace(/_/g, " ")}
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
