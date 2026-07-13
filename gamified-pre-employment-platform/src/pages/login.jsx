import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import backgroundImage from "../assets/images/skillquest-bg.png";

function Login() {
  const [role, setRole] = useState("candidate");
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    if (role === "candidate") {
      navigate("/candidate-dashboard");
    } else {
      navigate("/recruiter-dashboard");
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

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email address" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <label>Login As</label>
          <div className="role-options">
            <button
              type="button"
              className={role === "candidate" ? "role-btn active-role" : "role-btn"}
              onClick={() => setRole("candidate")}
            >
              🎮 Candidate
            </button>

            <button
              type="button"
              className={role === "recruiter" ? "role-btn active-role" : "role-btn"}
              onClick={() => setRole("recruiter")}
            >
              🏆 Recruiter
            </button>
          </div>

          <button type="submit" className="create-account-btn">
            🎮 Login and Play
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