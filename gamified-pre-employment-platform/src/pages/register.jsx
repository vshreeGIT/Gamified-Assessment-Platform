import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import backgroundImage from "../assets/images/skillquest-bg.png";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    college: "",
    department: "",
    role: "candidate",
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleRoleChange(newRole) {
    setFormData((prev) => ({ ...prev, role: newRole }));
  }

  function handleRegister(event) {
    event.preventDefault();

    if (formData.role === "candidate") {
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

          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />

          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number (e.g., 9876543210)"
            required
          />

          <label>College / Institution</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter your college or university"
          />

          <label>Department / Stream</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Computer Science & Engineering"
          />

          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />

          <label>Choose Your Role</label>
          <div className="role-options">
            <button
              type="button"
              className={formData.role === "candidate" ? "role-btn active-role" : "role-btn"}
              onClick={() => handleRoleChange("candidate")}
            >
              🎮 Candidate
            </button>

            <button
              type="button"
              className={formData.role === "recruiter" ? "role-btn active-role" : "role-btn"}
              onClick={() => handleRoleChange("recruiter")}
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

