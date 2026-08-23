import { demoIncidents } from "../lib/demoData";
import { useState } from "react";

export default function Incidents() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");

  const raise = () => {
    if (!title || !desc) {
      setMsg("Title and description required.");
      return;
    }
    setMsg(`Incident raised: ${title}`);
    setShowForm(false);
    setTitle("");
    setDesc("");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Operational Incidents</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Raise Incident
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={raise}>Submit</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {msg && <p style={{ color: "var(--success)", marginBottom: 12 }}>{msg}</p>}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Package</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {demoIncidents.map((i) => (
              <tr key={i.incidentId}>
                <td>{i.incidentId}</td>
                <td>{i.packageId}</td>
                <td>{i.title}</td>
                <td>
                  <span className={i.severity === "HIGH" ? "badge badge-danger" : "badge badge-warning"}>
                    {i.severity}
                  </span>
                </td>
                <td>{i.status}</td>
                <td style={{ fontSize: 12 }}>{new Date(i.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
