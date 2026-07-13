import { Link, useNavigate } from "react-router-dom";
import "../../styles/Challenges.css";

function Challenges() {
  const navigate = useNavigate();

  const challenges = [
    {
      icon: "💻",
      title: "Coding Arena",
      description: "Complete programming tasks and earn technical skill XP.",
      xp: "+150 XP",
      level: "Advanced",
      category: "Technical",
      status: "Start Quest",
      route: "/coding",
    },
    {
      icon: "🧩",
      title: "Logical Reasoning Sprint",
      description: "Solve quick puzzles and test your problem-solving speed.",
      xp: "+80 XP",
      level: "Beginner",
      category: "Aptitude",
      status: "Start Quest",
      route: "/reasoning",
    },
    {
      icon: "💬",
      title: "Communication Quest",
      description: "Handle workplace situations and improve communication skills.",
      xp: "+100 XP",
      level: "Intermediate",
      category: "Soft Skills",
      status: "Start Quest",
      route: "/communication",
    },
    {
      icon: "📊",
      title: "Data Detective",
      description: "Analyse a small business dataset and find useful insights.",
      xp: "+120 XP",
      level: "Intermediate",
      category: "Analytics",
      status: "Start Quest",
    },
    {
      icon: "🤝",
      title: "Teamwork Mission",
      description: "Choose the best actions in team collaboration scenarios.",
      xp: "+90 XP",
      level: "Beginner",
      category: "Soft Skills",
      status: "Start Quest",
    },
    {
      icon: "🎤",
      title: "Interview Battle",
      description: "Practice common interview questions and build confidence.",
      xp: "+130 XP",
      level: "Advanced",
      category: "Interview",
      status: "Locked",
    },
  ];

  const handleStart = (challenge) => {
    if (challenge.status === "Locked") return;
    if (challenge.route) navigate(challenge.route);
  };

  return (
    <div className="challenges-page">
      <aside className="challenge-sidebar">
        <div className="challenge-logo">
          🛡️ Skill<span>Quest</span>
        </div>

        <nav className="challenge-menu">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges" className="challenge-active">
            🎯 Challenges
          </Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile">👤 Profile</Link>
        </nav>

        <Link to="/" className="challenge-logout">
          🚪 Logout
        </Link>
      </aside>

      <main className="challenges-main">
        <header className="challenges-header">
          <div>
            <p className="challenge-small-title">QUEST BOARD</p>
            <h1>Choose Your Next Challenge 🎯</h1>
            <p>Complete quests, earn XP, unlock badges, and level up your career skills.</p>
          </div>

          <div className="challenge-player">
            <span>⚡ 320 XP</span>
            <div>🧑‍💻</div>
          </div>
        </header>

        <section className="challenge-filter-row">
          <button className="filter-active">All Challenges</button>
          <button>Aptitude</button>
          <button>Soft Skills</button>
          <button>Technical</button>
          <button>Analytics</button>
          <button>Interview</button>
        </section>

        <section className="challenge-grid">
          {challenges.map((challenge) => (
            <div
              className={`quest-card ${
                challenge.status === "Locked" ? "quest-locked" : ""
              }`}
              key={challenge.title}
            >
              <div className="quest-top">
                <div className="quest-icon">{challenge.icon}</div>
                <span className="quest-category">{challenge.category}</span>
              </div>

              <h2>{challenge.title}</h2>
              <p>{challenge.description}</p>

              <div className="quest-details">
                <span>⚡ {challenge.xp}</span>
                <span>🎮 {challenge.level}</span>
              </div>

              <button
                className={
                  challenge.status === "Locked"
                    ? "locked-quest-btn"
                    : "start-quest-btn"
                }
                disabled={challenge.status === "Locked"}
                onClick={() => handleStart(challenge)}
              >
                {challenge.status === "Locked" ? "🔒 Locked" : "▶ Start Quest"}
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Challenges;
