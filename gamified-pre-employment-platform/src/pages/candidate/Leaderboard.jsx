import { Link } from "react-router-dom";
import "../../styles/Leaderboard.css";


function Leaderboard() {
  const players = [
    { rank: 4, avatar: "👩💻", name: "Aarav Kumar", xp: "8,420", level: "Level 6" },
    { rank: 5, avatar: "👩🎓", name: "Diya Sharma", xp: "8,050", level: "Level 6" },
    { rank: 6, avatar: "👨💼", name: "Karthik Raj", xp: "7,680", level: "Level 5" },
    { rank: 7, avatar: "👩🔬", name: "Meera Nair", xp: "7,220", level: "Level 5" },
    { rank: 8, avatar: "🧑💻", name: "Vikram Singh", xp: "6,950", level: "Level 5" },
    { rank: 9, avatar: "👨🎓", name: "Rohan Das", xp: "6,520", level: "Level 4" },
  ];

  return (
    <div className="leaderboard-page">
      <aside className="leaderboard-sidebar">
        <div className="leaderboard-logo">
          🛡️ Skill<span>Quest</span>
        </div>

        <nav className="leaderboard-menu">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard" className="leaderboard-active">
            🏆 Leaderboard
          </Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile">👤 Profile</Link>
        </nav>

        <Link to="/" className="leaderboard-logout">
          🚪 Logout
        </Link>
      </aside>

      <main className="leaderboard-main">
        <header className="leaderboard-header">
          <div>
            <p className="leaderboard-small-title">HALL OF FAME</p>
            <h1>SkillQuest Leaderboard 🏆</h1>
            <p>Complete challenges, earn XP, and climb the rankings.</p>
          </div>

          <div className="leaderboard-player-xp">⚡ 320 XP</div>
        </header>

        <section className="leaderboard-tabs">
          <button className="leaderboard-tab-active">🏫 College</button>
          <button>🌍 Global</button>
          <button>📅 This Week</button>
        </section>

        <section className="top-three">
          <div className="winner-card second-place">
            <div className="winner-medal">🥈</div>
            <div className="winner-avatar">👩💼</div>
            <h3>Priya Menon</h3>
            <p>⚡ 9,850 XP</p>
            <span>2nd Place</span>
          </div>

          <div className="winner-card first-place">
            <div className="crown">👑</div>
            <div className="winner-medal">🥇</div>
            <div className="winner-avatar champion-avatar">🧑🚀</div>
            <h3>Arjun Krishna</h3>
            <p>⚡ 10,240 XP</p>
            <span>Champion</span>
          </div>

          <div className="winner-card third-place">
            <div className="winner-medal">🥉</div>
            <div className="winner-avatar">👨💻</div>
            <h3>Rahul Dev</h3>
            <p>⚡ 9,430 XP</p>
            <span>3rd Place</span>
          </div>
        </section>

        <section className="rank-panel">
          <div className="rank-panel-header">
            <div>
              <p className="leaderboard-small-title">TOP PLAYERS</p>
              <h2>Rankings</h2>
            </div>
            <span>Updated today</span>
          </div>

          <div className="rank-list">
            {players.map((player) => (
              <div className="rank-row" key={player.rank}>
                <div className="rank-number">#{player.rank}</div>
                <div className="rank-avatar">{player.avatar}</div>

                <div className="rank-player-info">
                  <h3>{player.name}</h3>
                  <p>{player.level}</p>
                </div>

                <div className="rank-xp">⚡ {player.xp} XP</div>
                <div className="rank-badge">🏅</div>
              </div>
            ))}
          </div>
        </section>

        <section className="your-rank-card">
          <div className="your-rank-icon">🎮</div>
          <div>
            <p>Your Current Rank</p>
            <h2>#18</h2>
          </div>
          <div className="your-rank-xp">
            <span>⚡ 320 XP</span>
            <small>Earn 200 XP to reach Rank #17</small>
          </div>
          <Link to="/challenges">Play Challenges</Link>
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;
