import { useNavigate } from "react-router-dom";
import codingLanguages from "../../../data/codingLanguages";
import "../../../styles/CodingHome.css";

function CodingHome() {
  const navigate = useNavigate();

  return (
    <div className="coding-page">
      <div className="coding-header">
        <h1>💻 Coding Arena</h1>
        <p>Choose your programming language and start your quest.</p>
      </div>

      <div className="language-grid">
        {codingLanguages.map((language) => (
          <div className="language-card" key={language.id}>
            <div className="language-icon">{language.icon}</div>

            <h2>{language.name}</h2>

            <p>{language.problems} Problems</p>

            <div className="difficulty">{language.difficulty}</div>

            <div className="progress-box">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${language.progress}%` }}
                ></div>
              </div>

              <span>{language.progress}% Completed</span>
            </div>

            <div className="xp">⚡ +{language.xp} XP</div>

            <button onClick={() => navigate(`/coding/${language.slug}`)}>
              Enter Arena →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodingHome;
