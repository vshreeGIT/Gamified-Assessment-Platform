import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/profileService";
import { getJobMatches, getProfileStrength } from "../../services/jobService";
import { logoutUser } from "../../services/authService";
import "../../styles/CandidateProfile.css";

function CandidateProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [prof, strength] = await Promise.all([
          getProfile(),
          getProfileStrength(),
        ]);
        if (cancelled) return;
        setProfile({ ...prof, profileStrength: strength?.strength ?? 0 });
        // Load job matches separately — non-fatal if it fails
        try {
          const matches = await getJobMatches();
          if (!cancelled) setJobMatches(matches);
        } catch {
          // job matches unavailable — show empty state
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function openEdit() {
    setEditForm({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      college: profile.college || "",
      department: profile.department || "",
      skills: (profile.skills || []).join(", "),
      preferredRole: profile.preferredRole || "",
      preferredLocation: profile.preferredLocation || "",
      preferredWorkType: profile.preferredWorkType || "",
    });
    setSaveError(null);
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        fullName: editForm.fullName.trim() || null,
        phone: editForm.phone.trim() || null,
        college: editForm.college.trim() || null,
        department: editForm.department.trim() || null,
        skills: editForm.skills
          ? editForm.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        preferredRole: editForm.preferredRole.trim() || null,
        preferredLocation: editForm.preferredLocation.trim() || null,
        preferredWorkType: editForm.preferredWorkType.trim() || null,
      };
      const updated = await updateProfile(payload);
      setProfile(updated);
      // Refresh profile strength after update
      try {
        const strength = await getProfileStrength();
        setProfile((p) => ({ ...p, profileStrength: strength?.strength ?? 0 }));
      } catch { /* non-fatal */ }
      // Refresh job matches since skills may have changed
      try {
        const matches = await getJobMatches();
        setJobMatches(matches);
      } catch { /* non-fatal */ }
      setEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  const xpToNextLevel = profile ? Math.max(0, profile.level * 500 - profile.xp) : 0;
  const xpProgress = profile
    ? Math.min(100, ((profile.xp - (profile.level - 1) * 500) / 500) * 100)
    : 0;

  // Top 3 job matches for the profile card
  const topMatches = jobMatches.slice(0, 3);

  if (loading) {
    return (
      <div className="profile-page" style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#cbc6ec" }}>Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page" style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#ff6b6b" }}>Failed to load profile: {error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-brand">🛡️ Skill<span>Quest</span></div>
        <nav className="profile-menu">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile" className="profile-active">👤 My Profile</Link>
        </nav>
        <button onClick={handleLogout} className="profile-logout">🚪 Logout</button>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <div>
            <p className="profile-kicker">PLAYER PROFILE</p>
            <h1>My Career Profile</h1>
            <p>Track your skills, progress, and job application journey.</p>
          </div>
          <button className="edit-profile-btn" onClick={openEdit}>✏️ Edit Profile</button>
        </header>

        <div className="profile-layout">
          {/* ── Left sidebar card ── */}
          <section className="candidate-info-card">
            <div className="candidate-cover" />
            <div className="candidate-avatar">👤</div>

            <div className="candidate-name-row">
              <h2>{profile.fullName || "—"}</h2>
              <span>Level {profile.level}</span>
            </div>

            <p className="candidate-role">
              {profile.preferredRole || "No preferred role set"}
            </p>

            <div className="candidate-xp">
              <div className="xp-text">
                <span>Current XP</span>
                <b>{profile.xp} / {profile.level * 500} XP</b>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>

            <div className="candidate-section">
              <h3>Skills</h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="profile-skills">
                  {profile.skills.map((s) => <span key={s}>{s}</span>)}
                </div>
              ) : (
                <p style={{ color: "#aaa6c9", fontSize: "12px", margin: 0 }}>
                  No skills added yet — edit your profile to add skills.
                </p>
              )}
            </div>

            <div className="candidate-section">
              <h3>Career Preferences</h3>
              <div className="profile-detail">
                <span>📍 Location</span>
                <b>{profile.preferredLocation || "Not set"}</b>
              </div>
              <div className="profile-detail">
                <span>💼 Preferred Role</span>
                <b>{profile.preferredRole || "Not set"}</b>
              </div>
              <div className="profile-detail">
                <span>🌐 Work Type</span>
                <b>{profile.preferredWorkType || "Not set"}</b>
              </div>
            </div>

            <div className="candidate-section">
              <h3>Profile Strength</h3>
              <div className="xp-bar" style={{ marginBottom: 6 }}>
                <div
                  className="xp-fill"
                  style={{ width: `${profile.profileStrength}%`, background: "linear-gradient(90deg,#61ef91,#a855f7)" }}
                />
              </div>
              <p style={{ color: "#aaa6c9", fontSize: "11px", margin: 0 }}>
                {profile.profileStrength}% complete
              </p>
            </div>
          </section>

          {/* ── Right content ── */}
          <section className="profile-content">
            {/* Assessment scores — only shown if real data exists */}
            <section className="profile-insights-grid">
              <article className="overall-score-card">
                <h3>Career Readiness</h3>
                <div className="score-circle">
                  <div>
                    <b>{profile.profileStrength}</b>
                    <span>/100</span>
                  </div>
                </div>
                <p>
                  {profile.profileStrength < 60
                    ? "Complete your profile to improve your score."
                    : profile.profileStrength < 100
                    ? "Good progress! Add missing profile fields to reach 100."
                    : "Profile complete! Keep earning XP through challenges."}
                </p>
              </article>

              <article className="career-insights-card">
                <div className="insight-title">
                  <h3>Profile Summary</h3>
                  {profile.xp > 0 && <span>Active</span>}
                </div>
                <div className="career-insight">
                  <span>🎓</span>
                  <div>
                    <b>{profile.college || "College not set"}</b>
                    <p>{profile.department || "Department not set"}</p>
                  </div>
                </div>
                <div className="career-insight">
                  <span>⚡</span>
                  <div>
                    <b>{profile.xp} XP earned</b>
                    <p>Level {profile.level} · {xpToNextLevel} XP to next level</p>
                  </div>
                </div>
                <div className="career-insight">
                  <span>📧</span>
                  <div>
                    <b>{profile.email}</b>
                    <p>{profile.phone || "Phone not set"}</p>
                  </div>
                </div>
              </article>

              <article className="match-score-card">
                <h3>Job Match Scores</h3>
                {topMatches.length > 0 ? (
                  <>
                    {topMatches.map((job) => (
                      <div key={job.id}>
                        <div className="match-row">
                          <span>{job.title}</span>
                          <b>{job.matchScore}%</b>
                        </div>
                        <div className="match-bar">
                          <div
                            className="match-fill"
                            style={{ width: `${job.matchScore}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <Link to="/job-matches">View All Job Matches →</Link>
                  </>
                ) : (
                  <p style={{ color: "#aaa6c9", fontSize: "12px", marginTop: 16 }}>
                    No job matches yet — add skills to your profile to see matches.
                  </p>
                )}
              </article>
            </section>

            {/* Assessment scores — truthful empty state */}
            <section className="application-section" style={{ marginTop: 22 }}>
              <div className="application-heading">
                <div>
                  <p className="profile-kicker">ASSESSMENT SCORES</p>
                  <h2>Challenge Results</h2>
                </div>
                <Link to="/challenges">Take a Challenge →</Link>
              </div>
              <p style={{ color: "#aaa6c9", fontSize: "13px", marginTop: 12 }}>
                Assessment scores appear here after you complete challenges. Visit the{" "}
                <Link to="/candidate-dashboard" style={{ color: "#ffd84c" }}>Dashboard</Link>{" "}
                to see your recent attempts.
              </p>
            </section>
          </section>
        </div>
      </main>

      {/* ── Edit modal ── */}
      {editing && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleSave}
            style={{
              background: "rgba(12,14,67,0.98)", border: "1px solid rgba(165,98,255,0.6)",
              borderRadius: 18, padding: 32, width: "min(520px,90vw)",
              maxHeight: "90vh", overflowY: "auto", color: "white",
            }}
          >
            <h2 style={{ margin: "0 0 20px", fontSize: 20 }}>Edit Profile</h2>
            {saveError && (
              <p style={{ color: "#ff6b6b", marginBottom: 12, fontSize: 13 }}>{saveError}</p>
            )}
            {[
              ["Full Name", "fullName", "text"],
              ["Phone", "phone", "text"],
              ["College", "college", "text"],
              ["Department", "department", "text"],
              ["Preferred Role", "preferredRole", "text"],
              ["Preferred Location", "preferredLocation", "text"],
              ["Preferred Work Type", "preferredWorkType", "text"],
            ].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: "#cbc6ec", marginBottom: 5 }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={editForm[key]}
                  onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: "100%", padding: "9px 12px", borderRadius: 8,
                    border: "1px solid rgba(165,98,255,0.4)", background: "rgba(255,255,255,0.06)",
                    color: "white", fontSize: 13,
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#cbc6ec", marginBottom: 5 }}>
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={editForm.skills}
                onChange={(e) => setEditForm((f) => ({ ...f, skills: e.target.value }))}
                placeholder="e.g. Java, Python, React"
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 8,
                  border: "1px solid rgba(165,98,255,0.4)", background: "rgba(255,255,255,0.06)",
                  color: "white", fontSize: 13,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1, padding: "11px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#6430cf,#9d4eff)", color: "white",
                  fontWeight: 800, cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  flex: 1, padding: "11px", borderRadius: 10,
                  border: "1px solid rgba(165,98,255,0.4)", background: "transparent",
                  color: "white", fontWeight: 700, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CandidateProfile;
