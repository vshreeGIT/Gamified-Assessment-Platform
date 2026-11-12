import { Link } from "react-router-dom";
import { CandidateIcon } from "../../components/candidate/CandidateIcon";
import CandidateNavigation from "../../components/candidate/CandidateNavigation";
import "../../styles/Badges.css";

function Badges() {
  const badges = [
    {
      icon: "code",
      title: "Code Starter",
      description: "Completed your first technical challenge.",
      xp: "Earned • +50 XP",
      earned: true,
    },
    {
      icon: "cpu",
      title: "Quick Thinker",
      description: "Finished a reasoning challenge with a strong score.",
      xp: "Earned • +80 XP",
      earned: true,
    },
    {
      icon: "target",
      title: "Goal Getter",
      description: "Completed three challenges in SkillQuest.",
      xp: "Earned • +100 XP",
      earned: true,
    },
    {
      icon: "message",
      title: "Communication Pro",
      description: "Complete the Communication Quest to unlock this badge.",
      xp: "Locked • Complete Communication Quest",
      earned: false,
    },
    {
      icon: "analytics",
      title: "Data Explorer",
      description: "Complete the Data Detective challenge to unlock.",
      xp: "Locked • Complete Data Detective",
      earned: false,
    },
    {
      icon: "award",
      title: "Top Performer",
      description: "Reach the top 10 on the leaderboard.",
      xp: "Locked • Reach leaderboard rank #10",
      earned: false,
    },
  ];

  return (
    <div className="badges-page">
      <CandidateNavigation active="/badges" />

      <main className="badges-main">
        <header className="badges-header">
          <div>
            <p className="badges-small-title">ACHIEVEMENT VAULT</p>
            <h1>My Badges</h1>
            <p>Complete challenges and collect badges that prove your skills.</p>
          </div>

          <div className="badge-level-box">
            <span><CandidateIcon name="zap" /> 320 XP</span>
            <strong>Level 1</strong>
          </div>
        </header>

        <section className="badge-summary">
          <div className="summary-card">
            <span><CandidateIcon name="shield" /></span>
            <div>
              <p>Badges Earned</p>
              <h2>3 / 6</h2>
            </div>
          </div>

          <div className="summary-card">
            <span><CandidateIcon name="zap" /></span>
            <div>
              <p>Badge XP Earned</p>
              <h2>230 XP</h2>
            </div>
          </div>

          <div className="summary-card">
            <span><CandidateIcon name="lock" /></span>
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
              <div className="badge-icon-circle"><CandidateIcon name={badge.icon} /></div>

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
