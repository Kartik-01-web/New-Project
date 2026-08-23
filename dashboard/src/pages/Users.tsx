const users = [
  { email: "admin@demo", role: "ADMIN", name: "Demo Admin" },
  { email: "dispatcher@demo", role: "DISPATCHER", name: "Demo Dispatcher" },
  { email: "supervisor@demo", role: "SUPERVISOR", name: "Demo Supervisor" },
  { email: "auditor@demo", role: "AUDITOR", name: "Demo Auditor" },
];

export default function Users() {
  return (
    <div>
      <h1 className="page-title">Users & Roles</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 14 }}>
        Create accounts via Firebase Authentication. Roles map to permissions enforced on the backend.
      </p>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td><span className="badge badge-info">{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
