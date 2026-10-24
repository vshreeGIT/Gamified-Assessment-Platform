import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCandidateDashboard } from "../../services/dashboardService";
import { logoutUser, isAuthenticated } from "../../services/authService";
import "../../styles/CandidateDashboard.css";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");
        const res = await getCandidateDashboard();
        if (!cancelled) {
          setData(res);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.message && err.message.toLowerCase().includes("unauthorized")) {
            logoutUser();
            navigate("/login");
          } else {
            setError(err.message || "Failed to load dashboard data");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleLogout(e) {
    e.preventDefault();
    logoutUser();
    navigate("/login");
  }

  // Fallback defaults while loading or on initial render
  const fullName = data?.fullName || "Player One";
  const xp = data?.xp ?? 0;
  const level = data?.level ?? 1;
  const levelTitle = data?.levelTitle || "Explorer";
  const currentLevelBaseXp = data?.currentLevelBaseXp ?? 0;
  const nextLevelXp = data?.nextLevelXp ?? 500;
  const xpToNextLevel = data?.xpToNextLevel ?? Math.max(0, nextLevelXp - xp);
  const completedChallenges = data?.completedChallengesCount ?? 0;
  const totalChallenges = data?.totalChallengesCount ?? 6;
  const badgesEarnedCount = data?.badgesEarnedCount ?? 0;
  const leaderboardRank = data?.leaderboardRank ? `#${data.leaderboardRank}` : "Unranked";

  const progressDenominator = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelBaseXp) / progressDenominator) * 100))
  );

  const displayBadges = data?.badges?.slice(0, 3) || [
    { icon: "💻", name: "Code Starter", earned: false },
    { icon: "🧠", name: "Quick Thinker", earned: false },
    { icon: "🔒", name: "Locked", earned: false },
  ];

  const recentAttempts = data?.recentAttempts || [];
  const communicationProEarned = Boolean(data?.badges?.some(
    (badge) => badge.name === "Communication Pro" && badge.earned
  ));

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="side-logo">
          🛡️ Skill<span>Quest</span>
        </div>

        <nav className="side-menu">
          <a className="menu-active" href="#dashboard">
            🏠 Dashboard
          </a>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile">👤 Profile</Link>
        </nav>

        <a href="#logout" onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </a>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="header-small">PLAYER DASHBOARD</p>
            <h1>Welcome back, {fullName}! 👋</h1>
            <p>Complete challenges, gain XP, and unlock your career path.</p>
          </div>

          <div className="header-profile">
            <span>🔔</span>
            <div className="avatar">👩‍💻</div>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#fca5a5",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <div>
              <p>Total XP</p>
              <h2>{loading ? "..." : `${xp} XP`}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <div>
              <p>Challenges Done</p>
              <h2>
                {loading ? "..." : `${completedChallenges} / ${totalChallenges}`}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🛡️</span>
            <div>
              <p>Badges Earned</p>
              <h2>{loading ? "..." : badgesEarnedCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div>
              <p>Leaderboard Rank</p>
              <h2>{loading ? "..." : leaderboardRank}</h2>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel progress-panel">
            <div className="panel-title">
              <div>
                <p className="header-small">LEVEL PROGRESS</p>
                <h2>
                  Level {level} {levelTitle}
                </h2>
              </div>
              <span className="level-badge">Level {level}</span>
            </div>

            <div className="xp-line">
              <span>
                {xp} / {nextLevelXp} XP
              </span>
              <span>
                {xpToNextLevel} XP to Level {level + 1}
              </span>
            </div>

            <div className="xp-progress">
              <div
                className="xp-filled"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <p className="panel-note">
              Keep completing challenges to unlock Level {level + 1} and new job opportunities.
            </p>
          </div>

          <div className="dashboard-panel badge-panel">
            <div className="panel-title">
              <div>
                <p className="header-small">LATEST BADGES</p>
                <h2>Your Collection</h2>
              </div>
              <Link to="/badges">View all</Link>
            </div>

            <div className="badge-row">
              {displayBadges.map((badge, idx) => (
                <div
                  key={badge.id || idx}
                  className={`badge-item ${!badge.earned ? "locked" : ""}`}
                >
                  <span>{badge.icon}</span>
                  <p>{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Attempts (if any) */}
        {recentAttempts.length > 0 && (
          <section className="dashboard-panel" style={{ marginBottom: "22px" }}>
            <div className="panel-title">
              <div>
                <p className="header-small">RECENT ACTIVITY</p>
                <h2>Latest Quest Attempts</h2>
              </div>
              <Link to="/reasoning">New Quest</Link>
            </div>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentAttempts.map((att) => (
                <div
                  key={att.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "10px",
                    border: "1px solid rgba(162, 101, 255, 0.25)",
                  }}
                >
                  <div>
                    <b style={{ color: "#fff" }}>{att.questType} ({att.difficulty})</b>
                    <p style={{ margin: "4px 0 0", color: "#cbc6ec", fontSize: "13px" }}>
                      Score: {att.score}/{att.total} • Accuracy: {att.accuracy}% • {att.badge}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: "#22c55e", fontWeight: "bold", fontSize: "15px" }}>
                      +{att.earnedXp} XP
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: att.passed ? "#22c55e" : "#f59e0b",
                        fontWeight: 600,
                      }}
                    >
                      {att.passed ? "PASSED" : "NEEDS PRACTICE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="dashboard-panel challenge-panel">
          <div className="panel-title">
            <div>
              <p className="header-small">AVAILABLE QUESTS</p>
              <h2>Continue Your Challenges</h2>
            </div>
            <Link to="/challenges">View all challenges</Link>
          </div>

          <div className="challenge-list">
            <div className="challenge-card">
              <div className="challenge-icon">🧩</div>
              <div className="challenge-info">
                <h3>Logical Reasoning Sprint</h3>
                <p>Test your problem-solving speed with quick puzzles.</p>
                <span>+80 XP • Beginner • +150 XP • Intermediate • +250 XP • Advanced</span>
              </div>
              <button onClick={() => navigate("/reasoning")}>Play Now</button>
            </div>

            <div className="challenge-card">
              <div className="challenge-icon">💬</div>
              <div className="challenge-info">
                <h3>Communication Quest</h3>
                <p>Answer workplace scenarios and improve soft skills.</p>
                <span>Up to +100 XP · five independent subdivisions</span>
                <small className="dashboard-communication-progress">
                  {data?.communicationCompletedSubdivisions ?? 0}/5 subdivisions completed · {data?.communicationAttemptsCount ?? 0} saved attempts · {data?.communicationXp ?? 0} XP earned
                </small>
                <small className={`dashboard-communication-badge ${communicationProEarned ? "earned" : ""}`}>
                  Communication Pro · {communicationProEarned ? "Unlocked" : "Locked"}
                </small>
              </div>
              <button onClick={() => navigate("/communication")}>Play Now</button>
            </div>

            <div className="challenge-card">
              <div className="challenge-icon">📊</div>
              <div className="challenge-info">
                <h3>Data Detective</h3>
                <p>Find insights from a small business data challenge.</p>
                <span>+120 XP • Intermediate</span>
                <small className="dashboard-communication-progress">
                  {data?.dataDetectiveCompletedInvestigations ?? 0}/3 investigations completed · {data?.dataDetectiveAttemptsCount ?? 0} saved attempts · {data?.dataDetectiveXp ?? 0} XP earned
                </small>
              </div>
              <button onClick={() => navigate("/data-detective")}>Play Now</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CandidateDashboard;
