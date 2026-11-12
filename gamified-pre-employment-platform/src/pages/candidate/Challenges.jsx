import { Link, useNavigate } from "react-router-dom";
import { CandidateIcon } from "../../components/candidate/CandidateIcon";
import CandidateNavigation from "../../components/candidate/CandidateNavigation";
import "../../styles/Challenges.css";

function Challenges() {
  const navigate = useNavigate();

  const challenges = [
    {
      icon: "code",
      title: "Coding Arena",
      description: "Complete programming tasks and earn technical skill XP.",
      xp: "+150 XP",
      level: "Advanced",
      category: "Technical",
      status: "Start Quest",
      route: "/coding",
    },
    {
      icon: "target",
      title: "Logical Reasoning Sprint",
      description: "Solve quick puzzles and test your problem-solving speed.",
      xp: "+80 XP",
      level: "Beginner",
      category: "Aptitude",
      status: "Start Quest",
      route: "/reasoning",
    },
    {
      icon: "message",
      title: "Communication Quest",
      description: "Handle workplace situations and improve communication skills.",
      xp: "+100 XP",
      level: "Intermediate",
      category: "Soft Skills",
      status: "Start Quest",
      route: "/communication",
    },
    {
      icon: "analytics",
      title: "Data Detective",
      description: "Analyse a small business dataset and find useful insights.",
      xp: "+120 XP",
      level: "Intermediate",
      category: "Analytics",
      status: "Start Quest",
    },
    {
      icon: "users",
      title: "Teamwork Mission",
      description: "Choose the best actions in team collaboration scenarios.",
      xp: "+90 XP",
      level: "Beginner",
      category: "Soft Skills",
      status: "Start Quest",
    },
    {
      icon: "microphone",
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
      <CandidateNavigation active="/challenges" />

      <main className="challenges-main">
        <header className="challenges-header">
          <div>
            <p className="challenge-small-title">QUEST BOARD</p>
            <h1>Choose Your Next Challenge</h1>
            <p>Complete quests, earn XP, unlock badges, and level up your career skills.</p>
          </div>

          <div className="challenge-player">
            <span><CandidateIcon name="zap" /> 320 XP</span>
            <div><CandidateIcon name="user" /></div>
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
                <div className="quest-icon"><CandidateIcon name={challenge.icon} /></div>
                <span className="quest-category">{challenge.category}</span>
              </div>

              <h2>{challenge.title}</h2>
              <p>{challenge.description}</p>

              <div className="quest-details">
                <span><CandidateIcon name="zap" /> {challenge.xp}</span>
                <span><CandidateIcon name="star" /> {challenge.level}</span>
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
                {challenge.status === "Locked" ? <><CandidateIcon name="lock" /> Locked</> : <><CandidateIcon name="play" /> Start Quest</>}
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Challenges;
