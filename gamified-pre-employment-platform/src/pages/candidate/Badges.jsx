import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCandidateDashboard } from "../../services/dashboardService";
import { logoutUser, isAuthenticated } from "../../services/authService";
import "../../styles/Badges.css";

function Badges() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        const res = await getCandidateDashboard();
        if (!cancelled) {
          setData(res);
        }
      } catch (err) {
        console.error("Badges page data error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const defaultBadges = [
    {
      icon: "💻",
      title: "Code Starter",
      description: "Completed your first technical challenge.",
      xp: "Locked • Complete Coding Challenge",
      earned: false,
    },
    {
      icon: "🧠",
      title: "Quick Thinker",
      description: "Finished a reasoning challenge with a strong score (>=70%).",
      xp: "Locked • Score 70%+ in Reasoning",
      earned: false,
    },
    {
      icon: "🎯",
      title: "Goal Getter",
      description: "Completed three challenges in SkillQuest.",
      xp: "Locked • Complete 3 Quests",
      earned: false,
    },
    {
      icon: "🏆",
      title: "Logic Master",
      description: "Achieved 90%+ accuracy on a Logical Reasoning Quest.",
      xp: "Locked • Achieve 90%+ Accuracy",
      earned: false,
    },
    {
      icon: "🌱",
      title: "Quest Beginner",
      description: "Started your quest journey and finished your first challenge.",
      xp: "Locked • Finish First Quest",
      earned: false,
    },
    {
      icon: "💬",
      title: "Communication Pro",
      description: "Complete the Communication Quest to unlock this badge.",
      xp: "Locked • Complete Communication Quest",
      earned: false,
    },
  ];

  const badges = data?.badges?.map((b) => ({
    icon: b.icon,
    title: b.name,
    description: b.description,
    xp: b.xpText || (b.earned ? "Earned" : "Locked"),
    earned: b.earned,
  })) || defaultBadges;

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalCount = badges.length;
  const remainingCount = totalCount - earnedCount;
  const progressPercent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;
  const userXp = data?.xp ?? 0;
  const userLevel = data?.level ?? 1;

  return (
    <div className="badges-page">
      <aside className="badges-sidebar">
        <div className="badges-logo">
          🛡️ Skill<span>Quest</span>
        </div>

        <nav className="badges-menu">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges" className="badges-active">
            🛡️ My Badges
          </Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile">👤 Profile</Link>
        </nav>

        <a
          href="#logout"
          onClick={(e) => {
            e.preventDefault();
            logoutUser();
            navigate("/login");
          }}
          className="badges-logout"
        >
          🚪 Logout
        </a>
      </aside>

      <main className="badges-main">
        <header className="badges-header">
          <div>
            <p className="badges-small-title">ACHIEVEMENT VAULT</p>
            <h1>My Badges 🛡️</h1>
            <p>Complete challenges and collect badges that prove your skills.</p>
          </div>

          <div className="badge-level-box">
            <span>⚡ {userXp} XP</span>
            <strong>Level {userLevel}</strong>
          </div>
        </header>

        <section className="badge-summary">
          <div className="summary-card">
            <span>🛡️</span>
            <div>
              <p>Badges Earned</p>
              <h2>
                {loading ? "..." : `${earnedCount} / ${totalCount}`}
              </h2>
            </div>
          </div>

          <div className="summary-card">
            <span>⚡</span>
            <div>
              <p>Total XP Earned</p>
              <h2>{loading ? "..." : `${userXp} XP`}</h2>
            </div>
          </div>

          <div className="summary-card">
            <span>🔒</span>
            <div>
              <p>Badges Remaining</p>
              <h2>{loading ? "..." : remainingCount}</h2>
            </div>
          </div>
        </section>

        <section className="badge-progress-panel">
          <div className="badge-panel-title">
            <div>
              <p className="badges-small-title">COLLECTION PROGRESS</p>
              <h2>{progressPercent}% Badge Collection Complete</h2>
            </div>
            <span>
              {earnedCount} of {totalCount}
            </span>
          </div>

          <div className="badge-progress-bar">
            <div
              className="badge-progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </section>

        <section className="badge-section-title">
          <div>
            <p className="badges-small-title">YOUR COLLECTION</p>
            <h2>Earned and Locked Badges</h2>
          </div>
        </section>

        <section className="badges-grid">
          {badges.map((badge, index) => (
            <div
              className={`badge-card ${!badge.earned ? "badge-locked-card" : ""}`}
              key={index}
            >
              <div className="badge-icon-circle">{badge.icon}</div>

              <h3>{badge.title}</h3>
              <p>{badge.description}</p>

              <span className={badge.earned ? "earned-text" : "locked-text"}>
                {badge.xp}
              </span>

              {badge.earned ? (
                <button className="badge-earned-btn">✓ Earned</button>
              ) : (
                <Link to="/challenges" className="badge-unlock-btn">
                  Unlock Badge
                </Link>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Badges;
