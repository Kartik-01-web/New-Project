import { Link } from "react-router-dom";
import { demoConflicts } from "../lib/demoData";

export default function Conflicts() {
  return (
    <div>
      <h1 className="page-title">Conflicts</h1>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Decision ID</th>
              <th>Package</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Explanation</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {demoConflicts.map((c) => (
              <tr key={c.decisionId}>
                <td>{c.decisionId}</td>
                <td>
                  <Link to={`/packages/${c.packageId}`}>{c.packageId}</Link>
                </td>
                <td>{(c.confidence * 100).toFixed(0)}%</td>
                <td>
                  <span className="badge badge-warning">{c.resolutionStatus.replace(/_/g, " ")}</span>
                </td>
                <td style={{ maxWidth: 320, fontSize: 13 }}>{c.explanation}</td>
                <td style={{ fontSize: 12 }}>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
