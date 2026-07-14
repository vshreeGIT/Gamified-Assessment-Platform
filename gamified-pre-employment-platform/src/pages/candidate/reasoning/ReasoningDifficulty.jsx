import { useNavigate } from "react-router-dom";
import "./ReasoningDifficulty.css";
function ReasoningDifficulty() {
  const navigate = useNavigate();

  return (
    <div className="reasoning-difficulty-page">
      <div className="reasoning-difficulty-container">

        {/* Header */}
        <div className="difficulty-header">
          <h1>🧠 Logical Reasoning Quest</h1>
          <p>
            Prepare yourself before starting the quest. Read the instructions
            carefully and earn maximum XP by completing all questions.
          </p>
        </div>

        {/* Main Card */}
        <div className="difficulty-card">

          <div className="difficulty-top">

            <div className="difficulty-icon">
              🧠
            </div>

            <div>
              <h2>Explorer Quest</h2>
              <span className="difficulty-badge">
                Beginner
              </span>
            </div>

          </div>

          {/* Details */}

          <div className="difficulty-info">

            <div className="info-box">
              <h3>📋 Questions</h3>
              <p>10</p>
            </div>

            <div className="info-box">
              <h3>⏱ Time</h3>
              <p>10 Minutes</p>
            </div>

            <div className="info-box">
              <h3>⚡ Reward</h3>
              <p>+80 XP</p>
            </div>

            <div className="info-box">
              <h3>🎯 Passing</h3>
              <p>70%</p>
            </div>

          </div>

          {/* Topics */}

          <div className="details-grid">

  <div className="topics">

    <h3>📚 Topics Covered</h3>

    <ul>
      <li>🧩 Number Series</li>
      <li>🧭 Direction Sense</li>
      <li>👨‍👩‍👧 Blood Relations</li>
      <li>🔤 Coding-Decoding</li>
      <li>⚖ Syllogism</li>
    </ul>

  </div>

  <div className="rules">

    <h3>📜 Quest Rules</h3>

    <ul>
      <li>✔ One mark for every correct answer.</li>
      <li>✔ No negative marking.</li>
      <li>✔ Timer cannot be paused.</li>
      <li>✔ Submit before time ends.</li>
      <li>✔ Complete all questions to earn XP.</li>
    </ul>

  </div>

</div>
          <button
            className="start-btn"
            onClick={() => navigate("/reasoning/question")}
          >
            ▶ Start Quest
          </button>

        </div>

      </div>
    </div>
  );
}

export default ReasoningDifficulty;