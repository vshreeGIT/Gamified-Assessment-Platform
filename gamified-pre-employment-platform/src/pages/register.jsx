import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import backgroundImage from "../assets/images/skillquest-bg.png";

function Register() {
  const [role, setRole] = useState("candidate");
  const navigate = useNavigate();

  function handleRegister(event) {
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

        <Link to="/login" className="top-auth-link">
          Already have an account? <b>Login</b>
        </Link>
      </nav>

      <section className="auth-content">
        <form className="game-auth-card" onSubmit={handleRegister}>
          <p className="card-label">NEW PLAYER</p>
          <h1>Create Your Account</h1>
          <p className="card-subtitle">
            Start challenges, earn XP, and unlock your career path.
          </p>

          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" required />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email address" required />

          <label>Password</label>
          <input type="password" placeholder="Create a password" required />

          <label>Choose Your Role</label>
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
            ✨ Create Account
          </button>

          <p className="bottom-auth-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;

