import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import backgroundImage from "../assets/images/skillquest-bg.png";
import { loginUser } from "../services/authService";

function Login() {
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      const userRole = (data.role || role).toLowerCase();

      if (userRole === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="auth-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="auth-overlay"></div>

      <nav className="auth-navbar">
        <Link to="/" className="auth-brand">
          🛡️ Skill<span>Quest</span>
        </Link>

        <Link to="/register" className="top-auth-link">
          New player? <b>Register</b>
        </Link>
      </nav>

      <section className="auth-content">
        <form className="game-auth-card" onSubmit={handleLogin}>
          <p className="card-label">WELCOME BACK</p>
          <h1>Continue Your Quest</h1>
          <p className="card-subtitle">
            Login to continue challenges and track your XP.
          </p>

          {error && (
            <div
              role="alert"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                color: "#fca5a5",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={loading}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />

          <label>Login As</label>
          <div className="role-options">
            <button
              type="button"
              className={role === "candidate" ? "role-btn active-role" : "role-btn"}
              onClick={() => setRole("candidate")}
              disabled={loading}
            >
              🎮 Candidate
            </button>

            <button
              type="button"
              className={role === "recruiter" ? "role-btn active-role" : "role-btn"}
              onClick={() => setRole("recruiter")}
              disabled={loading}
            >
              🏆 Recruiter
            </button>
          </div>

          <button
            type="submit"
            className="create-account-btn"
            disabled={loading}
          >
            {loading ? "⏳ Authenticating..." : "🎮 Login and Play"}
          </button>

          <p className="bottom-auth-text">
            New to SkillQuest? <Link to="/register">Create account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;