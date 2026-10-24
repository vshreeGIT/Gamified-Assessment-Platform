import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLeaderboard } from "../../services/dashboardService";
import { logoutUser, isAuthenticated } from "../../services/authService";
import "../../styles/Leaderboard.css";

function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
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
        const data = await getLeaderboard();
        if (!cancelled && Array.isArray(data)) {
          setPlayers(data);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const defaultPlayers = [
    { rank: 1, avatar: "🧑🚀", name: "Champion Player", xp: 1200, level: "Level 3", currentUser: false },
    { rank: 2, avatar: "👩💼", name: "Code Adventurer", xp: 850, level: "Level 2", currentUser: false },
    { rank: 3, avatar: "👨💻", name: "Logic Explorer", xp: 500, level: "Level 2", currentUser: false },
  ];

  const activePlayers = players.length > 0 ? players : defaultPlayers;
  const top1 = activePlayers[0] || defaultPlayers[0];
  const top2 = activePlayers[1] || defaultPlayers[1];
  const top3 = activePlayers[2] || defaultPlayers[2];
  const restPlayers = activePlayers.slice(3);

  const currentPlayer = activePlayers.find((p) => p.currentUser) || activePlayers[0];

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

        <a
          href="#logout"
          onClick={(e) => {
            e.preventDefault();
            logoutUser();
            navigate("/login");
          }}
          className="leaderboard-logout"
        >
          🚪 Logout
        </a>
      </aside>

      <main className="leaderboard-main">
        <header className="leaderboard-header">
          <div>
            <p className="leaderboard-small-title">HALL OF FAME</p>
            <h1>SkillQuest Leaderboard 🏆</h1>
            <p>Complete challenges, earn XP, and climb the rankings.</p>
          </div>

          <div className="leaderboard-player-xp">⚡ {currentPlayer?.xp ?? 0} XP</div>
        </header>

        <section className="leaderboard-tabs">
          <button className="leaderboard-tab-active">🏫 All Players</button>
          <button>🌍 Global</button>
          <button>📅 This Week</button>
        </section>

        <section className="top-three">
          <div className="winner-card second-place">
            <div className="winner-medal">🥈</div>
            <div className="winner-avatar">{top2.avatar || "👩💼"}</div>
            <h3>{top2.name}</h3>
            <p>⚡ {top2.xp.toLocaleString()} XP</p>
            <span>2nd Place</span>
          </div>

          <div className="winner-card first-place">
            <div className="crown">👑</div>
            <div className="winner-medal">🥇</div>
            <div className="winner-avatar champion-avatar">{top1.avatar || "🧑🚀"}</div>
            <h3>{top1.name}</h3>
            <p>⚡ {top1.xp.toLocaleString()} XP</p>
            <span>Champion</span>
          </div>

          <div className="winner-card third-place">
            <div className="winner-medal">🥉</div>
            <div className="winner-avatar">{top3.avatar || "👨💻"}</div>
            <h3>{top3.name}</h3>
            <p>⚡ {top3.xp.toLocaleString()} XP</p>
            <span>3rd Place</span>
          </div>
        </section>

        <section className="rank-panel">
          <div className="rank-panel-header">
            <div>
              <p className="leaderboard-small-title">TOP PLAYERS</p>
              <h2>Rankings</h2>
            </div>
            <span>{loading ? "Loading..." : "Live Data"}</span>
          </div>

          <div className="rank-list">
            {(restPlayers.length > 0 ? restPlayers : activePlayers).map((player) => (
              <div
                className={`rank-row ${player.currentUser ? "current-user-row" : ""}`}
                key={player.rank}
                style={player.currentUser ? { border: "1px solid #a855f7" } : {}}
              >
                <div className="rank-number">#{player.rank}</div>
                <div className="rank-avatar">{player.avatar || "🎮"}</div>

                <div className="rank-player-info">
                  <h3>{player.name} {player.currentUser ? "(You)" : ""}</h3>
                  <p>{player.level}</p>
                </div>

                <div className="rank-xp">⚡ {player.xp.toLocaleString()} XP</div>
                <div className="rank-badge">🏅</div>
              </div>
            ))}
          </div>
        </section>

        <section className="your-rank-card">
          <div className="your-rank-icon">🎮</div>
          <div>
            <p>Your Current Rank</p>
            <h2>#{currentPlayer?.rank ?? 1}</h2>
          </div>
          <div className="your-rank-xp">
            <span>⚡ {currentPlayer?.xp ?? 0} XP</span>
            <small>Complete quests to advance your rank</small>
          </div>
          <Link to="/challenges">Play Challenges</Link>
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;
