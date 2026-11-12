import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../../styles/RecruiterDashboard.scss";

const navigation = [
  { label: "Dashboard", path: "/recruiter/dashboard", icon: "⌂" },
  { label: "Assessments", path: "/recruiter/assessments", icon: "▤" },
  { label: "Create Assessment", path: "/recruiter/assessments/create", icon: "＋" },
  { label: "Candidates", path: "/recruiter/candidates", icon: "♙" },
  { label: "Results", path: "/recruiter/results", icon: "◈" },
  { label: "Analytics", path: "/recruiter/analytics", icon: "▥" },
  { label: "Settings", path: "/recruiter/settings", icon: "⚙" },
];

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RecruiterLayout({ children, headerLabel = "RECRUITER PORTAL", title = "Welcome back, Recruiter", subtitle, actions }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/recruiter/dashboard") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="recruiter-dashboard">
      <aside className="candidate-portal-sidebar recruiter-sidebar">
        <div className="candidate-portal-brand recruiter-brand">
          <span className="candidate-portal-mark brand-shield">SQ</span>
          <div>
            <strong>SkillQuest</strong>
            <small>Recruiter Portal</small>
          </div>
        </div>

        <p className="candidate-portal-label">WORKSPACE</p>
        <nav className="candidate-portal-nav recruiter-nav" aria-label="Recruiter navigation">
          {navigation.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={isActive(path) ? "candidate-portal-nav-item recruiter-nav-item active" : "candidate-portal-nav-item recruiter-nav-item"}
              aria-current={isActive(path) ? "page" : undefined}
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="recruiter-sidebar-bottom">
          <button className="candidate-portal-logout recruiter-logout" type="button" onClick={() => navigate("/login")}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="recruiter-main">
        <header className="recruiter-header">
          <div>
            <p className="dashboard-label">{headerLabel}</p>
            <h1>{title}</h1>
            {subtitle ? <p className="dashboard-subtitle">{subtitle}</p> : null}
          </div>

          <div className="header-profile">
            <button className="notification" type="button" aria-label="Notifications">
              ♧ <span />
            </button>
            <div className="profile">
              <div className="profile-avatar">HR</div>
              <div>
                <strong>HR Manager</strong>
                <small>Recruiter</small>
              </div>
              <span className="profile-arrow">▾</span>
            </div>
          </div>
        </header>

        {actions ? <div className="page-actions">{actions}</div> : null}
        {children}
      </main>
    </div>
  );
}
