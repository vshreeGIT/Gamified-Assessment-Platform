import { Link } from "react-router-dom";
import CandidateNavigation from "../../components/candidate/CandidateNavigation";
import { CandidateIcon } from "../../components/candidate/CandidateIcon";
import "../../styles/Leaderboard.css";

function Leaderboard() {
  const players = [
    { rank: 4, avatar: "AK", name: "Aarav Kumar", xp: "8,420", level: "Level 6" },
    { rank: 5, avatar: "DS", name: "Diya Sharma", xp: "8,050", level: "Level 6" },
    { rank: 6, avatar: "KR", name: "Karthik Raj", xp: "7,680", level: "Level 5" },
    { rank: 7, avatar: "MN", name: "Meera Nair", xp: "7,220", level: "Level 5" },
    { rank: 8, avatar: "VS", name: "Vikram Singh", xp: "6,950", level: "Level 5" },
    { rank: 9, avatar: "RD", name: "Rohan Das", xp: "6,520", level: "Level 4" },
  ];

  return (
    <div className="leaderboard-page">
      <CandidateNavigation active="/leaderboard" />

      <main className="leaderboard-main">
        <header className="leaderboard-header">
          <div>
            <p className="leaderboard-small-title">HALL OF FAME</p>
            <h1>SkillQuest Leaderboard <CandidateIcon name="award" /></h1>
            <p>Complete challenges, earn XP, and climb the rankings.</p>
          </div>

          <div className="leaderboard-player-xp"><CandidateIcon name="zap" /> 320 XP</div>
        </header>

        <section className="leaderboard-tabs">
          <button className="leaderboard-tab-active">College</button>
          <button>Global</button>
          <button>This Week</button>
        </section>

        <section className="top-three">
          <div className="winner-card second-place">
            <div className="winner-medal"><CandidateIcon name="award" /></div>
            <div className="winner-avatar">PM</div>
            <h3>Priya Menon</h3>
            <p><CandidateIcon name="zap" /> 9,850 XP</p>
            <span>2nd Place</span>
          </div>

          <div className="winner-card first-place">
            <div className="crown"><CandidateIcon name="award" /></div>
            <div className="winner-medal"><CandidateIcon name="award" /></div>
            <div className="winner-avatar champion-avatar">AK</div>
            <h3>Arjun Krishna</h3>
            <p><CandidateIcon name="zap" /> 10,240 XP</p>
            <span>Champion</span>
          </div>

          <div className="winner-card third-place">
            <div className="winner-medal"><CandidateIcon name="award" /></div>
            <div className="winner-avatar">RD</div>
            <h3>Rahul Dev</h3>
            <p><CandidateIcon name="zap" /> 9,430 XP</p>
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

                <div className="rank-xp"><CandidateIcon name="zap" /> {player.xp} XP</div>
                <div className="rank-badge"><CandidateIcon name="award" /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="your-rank-card">
          <div className="your-rank-icon"><CandidateIcon name="target" /></div>
          <div>
            <p>Your Current Rank</p>
            <h2>#18</h2>
          </div>
          <div className="your-rank-xp">
            <span><CandidateIcon name="zap" /> 320 XP</span>
            <small>Earn 200 XP to reach Rank #17</small>
          </div>
          <Link to="/challenges">Play Challenges</Link>
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;
