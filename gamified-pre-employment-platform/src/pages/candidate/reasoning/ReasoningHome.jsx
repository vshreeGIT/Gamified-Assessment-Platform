import { useNavigate } from "react-router-dom";
import "./ReasoningHome.css";
function ReasoningHome() {
  const navigate = useNavigate();

  const levels = [
    {
      icon: "🧠",
      title: "Beginner",
      questions: 10,
      badge: "Beginner",
      progress: 65,
      xp: 80,
      color: "green",
    },
    {
      icon: "🧩",
      title: "Intermediate",
      questions: 15,
      badge: "Intermediate",
      progress: 35,
      xp: 150,
      color: "orange",
    },
    {
      icon: "👑",
      title: "Expert",
      questions: 20,
      badge: "Advanced",
      progress: 10,
      xp: 250,
      color: "red",
    },
  ];

  return (
    <div className="reasoning-home">
      <div className="reasoning-container">

        <div className="reasoning-header">

          <h1>🧠 Logical Reasoning Arena</h1>

          <p>
            Solve exciting logical puzzles, sharpen your analytical thinking,
            earn XP and climb the leaderboard.
          </p>

        </div>

        <div className="reasoning-grid">

          {levels.map((level, index) => (
            <div
              key={index}
              className="reasoning-card"
            >

              <div className="reasoning-icon">
                {level.icon}
              </div>

              <h2>{level.title}</h2>

              <p>{level.questions} Questions</p>

              <span className="difficulty-tag">
                {level.badge}
              </span>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{ width: `${level.progress}%` }}
                ></div>

              </div>

              <p className="progress-text">
                {level.progress}% Completed
              </p>

              <h3 className="xp">
                ⚡ +{level.xp} XP
              </h3>

              <button
                onClick={() => navigate("/reasoning/difficulty")}
              >
                Start Quest →
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default ReasoningHome;