import { useNavigate } from "react-router-dom";
import "../../../styles/ReasoningHome.css";

function ReasoningHome() {
  const navigate = useNavigate();

  return (
    <div className="reasoning-home">

      <div className="hero">
        <h1>🧠 Logical Reasoning Sprint</h1>

        <p>
          Challenge your analytical thinking skills through fun logical reasoning
          puzzles. Earn XP, maintain streaks and unlock exciting badges while
          improving your problem-solving ability.
        </p>
      </div>

      <div className="features">

        <div className="feature-card">
          <h3>⏱ Timed Sprint</h3>
          <p>Solve questions before the timer ends.</p>
        </div>

        <div className="feature-card">
          <h3>🏆 Earn XP</h3>
          <p>Gain experience points for every correct answer.</p>
        </div>

        <div className="feature-card">
          <h3>🔥 Build Streaks</h3>
          <p>Maintain consecutive correct answers.</p>
        </div>

        <div className="feature-card">
          <h3>🎖 Unlock Badges</h3>
          <p>Complete milestones and collect achievements.</p>
        </div>

      </div>

      <div className="difficulty-section">

        <h2>Select Difficulty</h2>

        <div className="difficulty-cards">

          <div
            className="difficulty-card easy"
            onClick={() => navigate("/reasoning/difficulty")}
          >
            <h3>🟢 Easy</h3>
            <p>10 Questions</p>
            <p>10 Minutes</p>
            <button>Start Sprint</button>
          </div>

          <div
            className="difficulty-card medium"
            onClick={() => navigate("/reasoning/difficulty")}
          >
            <h3>🟠 Medium</h3>
            <p>15 Questions</p>
            <p>15 Minutes</p>
            <button>Start Sprint</button>
          </div>

          <div
            className="difficulty-card hard"
            onClick={() => navigate("/reasoning/difficulty")}
          >
            <h3>🔴 Hard</h3>
            <p>20 Questions</p>
            <p>20 Minutes</p>
            <button>Start Sprint</button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ReasoningHome;