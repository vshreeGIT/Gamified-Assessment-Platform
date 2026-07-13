import { Link } from "react-router-dom";
import backgroundImage from "../assets/images/skillquest-bg.png";

function Home() {
  return (
    <main
      className="game-home"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="game-overlay"></div>

      <nav className="game-navbar">
        <div className="brand">
          <span className="shield">🛡️</span>
          Skill<span>Quest</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="level-up">🏆 Level Up Your Future!</div>
      </nav>

      <section className="hero-content" id="home">
        <div className="xp-card player-card">
          <div className="avatar">🧑‍🚀</div>
          <div>
            <strong>Player One</strong>
            <p>Level 1</p>
            <div className="xp-bar">
              <span></span>
            </div>
            <small>0 / 1000 XP</small>
          </div>
        </div>

        <div className="hero-center">
          <p className="welcome-text">WELCOME TO</p>
          <h1>
            Skill<span>Quest</span>
          </h1>

          <h2>Gamified Pre-Employment Assessment Platform</h2>

          <p className="hero-description">
            Play skill-based challenges, earn badges, improve your abilities,
            and get matched with the right job.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="game-btn login-btn">
              🎮 Login
            </Link>

            <Link to="/register" className="game-btn register-btn">
              ✨ Register
            </Link>
          </div>

          <p className="journey-text">⭐ Start your journey and level up your career! ⭐</p>
        </div>

        <div className="feature-cards" id="features">
          <div className="feature-card">
            <span>🎯</span>
            <div>
              <strong>Challenges</strong>
              <p>Complete and earn XP</p>
            </div>
          </div>

          <div className="feature-card">
            <span>🛡️</span>
            <div>
              <strong>Badges</strong>
              <p>Collect and showcase</p>
            </div>
          </div>

          <div className="feature-card">
            <span>🏆</span>
            <div>
              <strong>Leaderboard</strong>
              <p>Compete and rank up</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;