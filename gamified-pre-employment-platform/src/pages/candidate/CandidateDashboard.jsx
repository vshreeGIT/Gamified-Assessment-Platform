import { Link } from "react-router-dom";
import { CandidateIcon } from "../../components/candidate/CandidateIcon";
import CandidateNavigation from "../../components/candidate/CandidateNavigation";
import "../../styles/CandidateDashboard.css";
function CandidateDashboard() {
  return (
    <div className="dashboard-page">
      <CandidateNavigation active="/candidate-dashboard" />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="header-small">PLAYER DASHBOARD</p>
            <h1>Welcome back, Player One!</h1>
            <p>Complete challenges, gain XP, and unlock your career path.</p>
          </div>

          <div className="header-profile">
            <span><CandidateIcon name="bell" /></span>
            <div className="avatar"><CandidateIcon name="user" /></div>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon"><CandidateIcon name="zap" /></span>
            <div>
              <p>Total XP</p>
              <h2>320 XP</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon"><CandidateIcon name="target" /></span>
            <div>
              <p>Challenges Done</p>
              <h2>4 / 12</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon"><CandidateIcon name="shield" /></span>
            <div>
              <p>Badges Earned</p>
              <h2>3</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon"><CandidateIcon name="award" /></span>
            <div>
              <p>Leaderboard Rank</p>
              <h2>#18</h2>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel progress-panel">
            <div className="panel-title">
              <div>
                <p className="header-small">LEVEL PROGRESS</p>
                <h2>Level 1 Explorer</h2>
              </div>
              <span className="level-badge">Level 1</span>
            </div>

            <div className="xp-line">
              <span>320 / 1000 XP</span>
              <span>680 XP to Level 2</span>
            </div>

            <div className="xp-progress">
              <div className="xp-filled"></div>
            </div>

            <p className="panel-note">
              Keep completing challenges to unlock Level 2 and new job opportunities.
            </p>
          </div>

          <div className="dashboard-panel badge-panel">
            <div className="panel-title">
              <div>
                <p className="header-small">LATEST BADGES</p>
                <h2>Your Collection</h2>
              </div>
              <a href="#badges">View all</a>
            </div>

            <div className="badge-row">
              <div className="badge-item">
                <span><CandidateIcon name="code" /></span>
                <p>Code Starter</p>
              </div>
              <div className="badge-item">
                <span><CandidateIcon name="cpu" /></span>
                <p>Quick Thinker</p>
              </div>
              <div className="badge-item locked">
                <span><CandidateIcon name="lock" /></span>
                <p>Locked</p>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel challenge-panel">
          <div className="panel-title">
            <div>
              <p className="header-small">AVAILABLE QUESTS</p>
              <h2>Continue Your Challenges</h2>
            </div>
            <a href="#challenges">View all challenges</a>
          </div>

          <div className="challenge-list">
            <div className="challenge-card">
              <div className="challenge-icon"><CandidateIcon name="target" /></div>
              <div className="challenge-info">
                <h3>Logical Reasoning Sprint</h3>
                <p>Test your problem-solving speed with quick puzzles.</p>
                <span>+80 XP • Beginner</span>
              </div>
              <button>Play Now</button>
            </div>

            <div className="challenge-card">
              <div className="challenge-icon"><CandidateIcon name="message" /></div>
              <div className="challenge-info">
                <h3>Communication Quest</h3>
                <p>Answer workplace scenarios and improve soft skills.</p>
                <span>+100 XP • Intermediate</span>
              </div>
              <button>Play Now</button>
            </div>

            <div className="challenge-card">
              <div className="challenge-icon"><CandidateIcon name="analytics" /></div>
              <div className="challenge-info">
                <h3>Data Detective</h3>
                <p>Find insights from a small business data challenge.</p>
                <span>+120 XP • Intermediate</span>
              </div>
              <button>Play Now</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CandidateDashboard;