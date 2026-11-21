import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getToken, logoutUser } from "../../services/authService";
import "../../styles/AdminDashboard.css";

const API_BASE_URL = "http://localhost:8080/api";

const EMPTY_FORM = { fullName: "", email: "", phone: "", password: "" };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ...form, role: "RECRUITER" }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Unexpected server response. Please check the backend.");
      }

      if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      setSuccess(
        `✅ Recruiter account created for ${data.fullName} (${data.email}). They can now log in.`
      );
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message || "Failed to create recruiter account.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="admin-dashboard">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">SQ</div>
          <div>
            <strong>SkillQuest</strong>
            <small>Admin Portal</small>
          </div>
        </div>

        <p className="admin-nav-label">Workspace</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          <button type="button" className="admin-nav-item active">
            <span>⌂</span>
            Dashboard
          </button>
          <button type="button" className="admin-nav-item" onClick={() => document.getElementById("create-recruiter-form")?.scrollIntoView({ behavior: "smooth" })}>
            <span>＋</span>
            Create Recruiter
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <button type="button" className="admin-logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-header-label">ADMIN PORTAL</p>
            <h1>Admin Dashboard</h1>
            <p className="admin-header-subtitle">
              Manage recruiter accounts and platform access.
            </p>
          </div>
        </header>

        {/* Welcome banner */}
        <div className="admin-welcome-banner">
          <div className="admin-welcome-icon">🛡️</div>
          <div>
            <h2>Welcome back, {user?.fullName || "Administrator"}</h2>
            <p>
              You have full administrative access. Use this portal to provision
              recruiter accounts for your hiring team.
            </p>
          </div>
        </div>

        {/* Create Recruiter form */}
        <div className="admin-form-panel" id="create-recruiter-form">
          <div className="admin-form-panel-heading">
            <div className="admin-form-panel-icon">👤</div>
            <div>
              <h2>Create Recruiter Account</h2>
              <p>
                Provision a new recruiter. The account will be active immediately
                and the recruiter can log in right away.
              </p>
            </div>
          </div>

          {success && (
            <div className="admin-alert admin-alert-success" role="status">
              {success}
            </div>
          )}

          {error && (
            <div className="admin-alert admin-alert-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <label>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Jane Smith"
                  required
                  disabled={loading}
                  autoComplete="off"
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="recruiter@company.com"
                  required
                  disabled={loading}
                  autoComplete="off"
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Digits only, 7–15 characters"
                  pattern="\d{7,15}"
                  title="Phone must be 7–15 digits"
                  required
                  disabled={loading}
                  autoComplete="off"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </label>

              <label className="wide">
                Role
                <div className="admin-role-badge">🏆 RECRUITER — assigned automatically</div>
              </label>
            </div>

            <button
              type="submit"
              className="admin-submit-btn wide"
              disabled={loading}
            >
              {loading ? "⏳ Creating Account..." : "＋ Create Recruiter Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
