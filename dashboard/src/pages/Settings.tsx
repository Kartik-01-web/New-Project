import { useState } from "react";
import { demoSettings } from "../lib/demoData";

export default function Settings() {
  const [settings, setSettings] = useState(demoSettings);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  const save = () => {
    if (reason.trim().length < 5) {
      setMsg("Reason required for settings changes.");
      return;
    }
    setMsg("Settings saved. Change recorded in audit history.");
  };

  return (
    <div>
      <h1 className="page-title">System Settings</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={settings.autoResolveEnabled}
            onChange={(e) => setSettings({ ...settings, autoResolveEnabled: e.target.checked })}
          />
          Auto-resolve high-confidence conflicts
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={settings.requireOverrideReason}
            onChange={(e) => setSettings({ ...settings, requireOverrideReason: e.target.checked })}
          />
          Require reason for manual overrides
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={settings.requireSupervisorApproval}
            onChange={(e) => setSettings({ ...settings, requireSupervisorApproval: e.target.checked })}
          />
          Require supervisor approval for corrections
        </label>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>High confidence threshold</label>
          <input
            type="number"
            step="0.01"
            value={settings.highConfidenceThreshold}
            onChange={(e) => setSettings({ ...settings, highConfidenceThreshold: parseFloat(e.target.value) })}
            style={{ display: "block", width: 100, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Medium confidence threshold</label>
          <input
            type="number"
            step="0.01"
            value={settings.mediumConfidenceThreshold}
            onChange={(e) => setSettings({ ...settings, mediumConfidenceThreshold: parseFloat(e.target.value) })}
            style={{ display: "block", width: 100, marginTop: 4 }}
          />
        </div>

        <textarea
          placeholder="Reason for change..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <button className="btn btn-primary" onClick={save}>Save Settings</button>
        {msg && <p style={{ marginTop: 12, color: "var(--success)", fontSize: 13 }}>{msg}</p>}
      </div>
    </div>
  );
}
