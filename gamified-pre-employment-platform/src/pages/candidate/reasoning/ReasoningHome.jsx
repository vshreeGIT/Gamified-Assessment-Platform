import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidateDashboard } from "../../../services/dashboardService";
import { isAuthenticated, logoutUser } from "../../../services/authService";
import "./ReasoningHome.css";

function ReasoningHome() {
  const navigate = useNavigate();
  const [progressByDifficulty, setProgressByDifficulty] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  });

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated()) {
      navigate("/login");
      return () => {
        cancelled = true;
      };
    }

    async function loadProgress() {
      try {
        const dashboard = await getCandidateDashboard();
        if (!cancelled && dashboard.reasoningProgress) {
          setProgressByDifficulty(dashboard.reasoningProgress);
        }
      } catch (err) {
        if (!cancelled && err.message?.toLowerCase().includes("unauthorized")) {
          logoutUser();
          navigate("/login");
        }
      }
    }

    loadProgress();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const levels = [
    {
      icon: "🧠",
      title: "Beginner",
      difficultyKey: "beginner",
      questions: 10,
      badge: "Beginner",
      xp: 80,
      color: "green",
    },
    {
      icon: "🧩",
      title: "Intermediate",
      difficultyKey: "intermediate",
      questions: 15,
      badge: "Intermediate",
      xp: 150,
      color: "orange",
    },
    {
      icon: "👑",
      title: "Advanced",
      difficultyKey: "advanced",
      questions: 20,
      badge: "Advanced",
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
          {levels.map((level) => {
            const progress = progressByDifficulty[level.difficultyKey] ?? 0;
            return (
              <div key={level.difficultyKey} className="reasoning-card">
                <div className="reasoning-icon">{level.icon}</div>

                <h2>{level.title}</h2>

                <p>{level.questions} Questions</p>

                <span className="difficulty-tag">{level.badge}</span>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="progress-text">{progress}% Completed</p>

              <h3 className="xp">⚡ +{level.xp} XP</h3>

                <button
                onClick={() =>
                  navigate(`/reasoning/difficulty/${level.difficultyKey}`)
                }
              >
                Start Quest →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReasoningHome;
