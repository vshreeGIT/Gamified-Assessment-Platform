import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getChallengeProgress } from "../../services/challengeProgressService";
import "../../styles/Challenges.css";

function Challenges() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    getChallengeProgress().then(setProgress).catch((error) => setProgressError(error.message || "Unable to verify quest progress."))
      .finally(() => setProgressLoading(false));
  }, []);

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
      id: "coding",
    },
    {
      icon: "🧩",
      title: "Logical Reasoning Sprint",
      id: "reasoning",
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
      id: "communication",
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
      id: "data-detective",
      description: "Analyse a small business dataset and find useful insights.",
      xp: "+120 XP",
      level: "Intermediate",
      category: "Analytics",
      status: "Start Quest",
      route: "/data-detective",
    },
    {
      icon: "🤝",
      title: "Teamwork Mission",
      description: "Choose the best actions in team collaboration scenarios.",
      xp: "+90 XP",
      level: "Beginner",
      category: "Soft Skills",
      status: "Start Quest",
      id: "teamwork",
      route: "/teamwork",
    },
    {
      icon: "🎤",
      title: "Interview Battle",
      description: "Practice common interview questions and build confidence.",
      xp: "+130 XP",
      level: "Advanced",
      category: "Interview",
      status: "Start Quest",
      id: "interview",
      route: "/interview-battle",
    },
  ];

  const handleStart = (challenge, state) => {
    if (state === "LOCKED") return;
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
            <span>⚡ {progressLoading ? "…" : `${progress?.totalXp ?? 0} XP`}</span>
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
          {challenges.map((challenge) => {
            const state = challengeState(challenge, progress, progressLoading);
            return (
            <div
              className={`quest-card ${state === "LOCKED" ? "quest-locked" : ""} quest-state-${state.toLowerCase()}`}
              key={challenge.title}
            >
              <div className="quest-top">
                <div className="quest-icon">{challenge.icon}</div>
                <span className="quest-category">{challenge.category}</span>
              </div>

              <h2>{challenge.title}</h2>
              <p>{challenge.description}</p>
              {challenge.id && <div className={`quest-progress-state ${state.toLowerCase()}`}>
                {state === "LOCKED" ? "🔒 Locked" : challenge.id === "interview" && progress?.interviewProgressionBypassed ? "Local Test Mode · Available" : stateLabel(state)}
              </div>}
              {challenge.id && state === "LOCKED" && (
                <p className="quest-prerequisite-message">{progressLoading ? "Checking prerequisites…" : progressError || progress?.quests?.[challenge.id]?.missingPrerequisites?.length
                  ? (progressError || `Complete: ${progress.quests[challenge.id].missingPrerequisites.join(", ")}`)
                  : "Complete the required earlier quests first."}</p>
              )}

              <div className="quest-details">
                <span>⚡ {challenge.xp}</span>
                <span>🎮 {challenge.level}</span>
              </div>

              <button
                className={state === "LOCKED" ? "locked-quest-btn" : "start-quest-btn"}
                disabled={state === "LOCKED"}
                onClick={() => handleStart(challenge, state)}
              >
                {buttonLabel(state)}
              </button>
            </div>
          );})}
        </section>
      </main>
    </div>
  );
}

function challengeState(challenge, progress, loading) {
  if (!challenge.id) return "AVAILABLE";
  if (challenge.id !== "interview") {
    if (loading || !progress?.quests?.[challenge.id]) return "AVAILABLE";
    const state = progress.quests[challenge.id].status;
    return state === "LOCKED" ? "AVAILABLE" : state;
  }
  if (loading || !progress?.quests?.[challenge.id]) return "LOCKED";
  return progress.quests[challenge.id].status;
}

function stateLabel(state) {
  return ({ PASSED: "Passed", IN_PROGRESS: "In Progress", ATTEMPTED: "Attempted", AVAILABLE: "Available", LOCKED: "Locked" })[state] || "Available";
}

function buttonLabel(state) {
  return ({ PASSED: "▶ Play Again", IN_PROGRESS: "▶ Resume Quest", ATTEMPTED: "▶ Try Again", LOCKED: "🔒 Locked" })[state] || "▶ Start Quest";
}

export default Challenges;
