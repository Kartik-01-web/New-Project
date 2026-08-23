import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Overview from "./pages/Overview";
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import Conflicts from "./pages/Conflicts";
import ManualReview from "./pages/ManualReview";
import Incidents from "./pages/Incidents";
import Drivers from "./pages/Drivers";
import Devices from "./pages/Devices";
import AuditTrail from "./pages/AuditTrail";
import BusinessRules from "./pages/BusinessRules";
import DeliveryTypes from "./pages/DeliveryTypes";
import WorkflowConfig from "./pages/WorkflowConfig";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/packages", label: "Packages" },
  { to: "/conflicts", label: "Conflicts" },
  { to: "/manual-review", label: "Manual Reviews" },
  { to: "/incidents", label: "Incidents" },
  { to: "/drivers", label: "Drivers" },
  { to: "/devices", label: "Devices" },
  { to: "/audit", label: "Audit Trail" },
  { to: "/rules", label: "Business Rules" },
  { to: "/delivery-types", label: "Delivery Types" },
  { to: "/workflow", label: "Workflow States" },
  { to: "/users", label: "Users & Roles" },
  { to: "/settings", label: "System Settings" },
];

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">EdgeSync</div>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/conflicts" element={<Conflicts />} />
          <Route path="/manual-review" element={<ManualReview />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/audit" element={<AuditTrail />} />
          <Route path="/rules" element={<BusinessRules />} />
          <Route path="/delivery-types" element={<DeliveryTypes />} />
          <Route path="/workflow" element={<WorkflowConfig />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
