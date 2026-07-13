import { Link } from "react-router-dom";
import "../../styles/Badges.css";

function Badges() {
  const badges = [
    {
      icon: "💻",
      title: "Code Starter",
      description: "Completed your first technical challenge.",
      xp: "Earned • +50 XP",
      earned: true,
    },
    {
      icon: "🧠",
      title: "Quick Thinker",
      description: "Finished a reasoning challenge with a strong score.",
      xp: "Earned • +80 XP",
      earned: true,
    },
    {
      icon: "🎯",
      title: "Goal Getter",
      description: "Completed three challenges in SkillQuest.",
      xp: "Earned • +100 XP",
      earned: true,
    },
    {
      icon: "💬",
      title: "Communication Pro",
      description: "Complete the Communication Quest to unlock this badge.",
      xp: "Locked • Complete Communication Quest",
      earned: false,
    },
    {
      icon: "📊",
      title: "Data Explorer",
      description: "Complete the Data Detective challenge to unlock.",
      xp: "Locked • Complete Data Detective",
      earned: false,
    },
    {
      icon: "🏆",
      title: "Top Performer",
      description: "Reach the top 10 on the leaderboard.",
      xp: "Locked • Reach leaderboard rank #10",
      earned: false,
    },
  ];

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
          <a href="#leaderboard">🏆 Leaderboard</a>
          <a href="#jobs">💼 Job Matches</a>
          <a href="#profile">👤 Profile</a>
        </nav>

        <Link to="/" className="badges-logout">
          🚪 Logout
        </Link>
      </aside>

      <main className="badges-main">
        <header className="badges-header">
          <div>
            <p className="badges-small-title">ACHIEVEMENT VAULT</p>
            <h1>My Badges 🛡️</h1>
            <p>Complete challenges and collect badges that prove your skills.</p>
          </div>

          <div className="badge-level-box">
            <span>⚡ 320 XP</span>
            <strong>Level 1</strong>
          </div>
        </header>

        <section className="badge-summary">
          <div className="summary-card">
            <span>🛡️</span>
            <div>
              <p>Badges Earned</p>
              <h2>3 / 6</h2>
            </div>
          </div>

          <div className="summary-card">
            <span>⚡</span>
            <div>
              <p>Badge XP Earned</p>
              <h2>230 XP</h2>
            </div>
          </div>

          <div className="summary-card">
            <span>🔒</span>
            <div>
              <p>Badges Remaining</p>
              <h2>3</h2>
            </div>
          </div>
        </section>

        <section className="badge-progress-panel">
          <div className="badge-panel-title">
            <div>
              <p className="badges-small-title">COLLECTION PROGRESS</p>
              <h2>50% Badge Collection Complete</h2>
            </div>
            <span>3 of 6</span>
          </div>

          <div className="badge-progress-bar">
            <div className="badge-progress-fill"></div>
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
