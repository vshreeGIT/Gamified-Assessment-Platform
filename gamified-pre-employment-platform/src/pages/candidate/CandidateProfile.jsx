import { Link } from "react-router-dom";
import "../../styles/CandidateProfile.css";

function CandidateProfile() {
  const scoreCards = [
    { value: "91%", label: "Ability Test", icon: "⚡" },
    { value: "90%", label: "Availability", icon: "📅" },
    { value: "87%", label: "Leadership", icon: "👑" },
    { value: "61%", label: "Communication", icon: "💬" },
    { value: "96%", label: "Responsibility", icon: "🛡️" },
    { value: "45%", label: "Loyalty", icon: "🤝" },
  ];

  const applications = [
    {
      role: "Frontend Developer Intern",
      company: "TechNova Solutions",
      stages: [
        ["All", "12"], ["New", "3"], ["Screening", "2"],
        ["Interview", "1"], ["Technical", "0"], ["Final", "0"], ["Hired", "0"],
      ],
      activeStage: 3,
    },
    {
      role: "Data Analyst Intern",
      company: "DataSphere Analytics",
      stages: [
        ["All", "8"], ["New", "2"], ["Screening", "3"],
        ["Interview", "2"], ["Technical", "1"], ["Final", "0"], ["Hired", "0"],
      ],
      activeStage: 4,
    },
    {
      role: "UI/UX Design Intern",
      company: "BrightPath Digital",
      stages: [
        ["All", "15"], ["New", "8"], ["Screening", "4"],
        ["Interview", "2"], ["Technical", "0"], ["Final", "0"], ["Hired", "0"],
      ],
      activeStage: 2,
    },
  ];

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-brand">
          🛡️ Skill<span>Quest</span>
        </div>

        <nav className="profile-menu">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches">💼 Job Matches</Link>
          <Link to="/candidate-profile" className="profile-active">
            👤 My Profile
          </Link>
        </nav>

        <Link to="/" className="profile-logout">
          🚪 Logout
        </Link>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <div>
            <p className="profile-kicker">PLAYER PROFILE</p>
            <h1>My Career Profile</h1>
            <p>Track your skills, progress, and job application journey.</p>
          </div>

          <button className="edit-profile-btn">✏️ Edit Profile</button>
        </header>

        <div className="profile-layout">
          <section className="candidate-info-card">
            <div className="candidate-cover"></div>

            <div className="candidate-avatar">👩🏻💻</div>

            <div className="candidate-name-row">
              <h2>Player One</h2>
              <span>Level 1</span>
            </div>

            <p className="candidate-role">Aspiring Software Developer</p>

            <div className="candidate-xp">
              <div className="xp-text">
                <span>Current XP</span>
                <b>320 / 1000 XP</b>
              </div>
              <div className="xp-bar">
                <div className="xp-fill"></div>
              </div>
            </div>

            <div className="candidate-section">
              <h3>Skills</h3>
              <div className="profile-skills">
                <span>Java</span>
                <span>Python</span>
                <span>React</span>
                <span>SQL</span>
                <span>Power BI</span>
                <span>HTML/CSS</span>
              </div>
            </div>

            <div className="candidate-section">
              <h3>Career Preferences</h3>

              <div className="profile-detail">
                <span>📍 Location</span>
                <b>Chennai, Tamil Nadu</b>
              </div>

              <div className="profile-detail">
                <span>💼 Preferred Role</span>
                <b>Software Developer</b>
              </div>

              <div className="profile-detail">
                <span>🌐 Work Type</span>
                <b>Internship / Full Time</b>
              </div>
            </div>

            <div className="candidate-section">
              <h3>Achievements</h3>

              <div className="mini-achievement">
                <span>🎯</span>
                <div>
                  <b>Challenge Starter</b>
                  <p>Completed your first challenge</p>
                </div>
              </div>

              <div className="mini-achievement">
                <span>🔥</span>
                <div>
                  <b>3 Day Streak</b>
                  <p>Keep learning every day</p>
                </div>
              </div>
            </div>

            <button className="profile-contact-btn">📩 Contact Recruiter</button>
          </section>

          <section className="profile-content">
            <section className="score-grid">
              {scoreCards.map((score) => (
                <article className="score-card" key={score.label}>
                  <span className="score-icon">{score.icon}</span>
                  <h3>{score.value}</h3>
                  <p>{score.label}</p>
                </article>
              ))}
            </section>

            <section className="profile-insights-grid">
              <article className="overall-score-card">
                <h3>Career Readiness Score</h3>

                <div className="score-circle">
                  <div>
                    <b>86</b>
                    <span>/100</span>
                  </div>
                </div>

                <p>Great progress! Keep completing challenges to level up.</p>
              </article>

              <article className="career-insights-card">
                <div className="insight-title">
                  <h3>Overall Score</h3>
                  <span>High Potential</span>
                </div>

                <div className="career-insight">
                  <span>🏅</span>
                  <div>
                    <b>Top Performer</b>
                    <p>Your challenge score is in the top 15%.</p>
                  </div>
                </div>

                <div className="career-insight">
                  <span>🧠</span>
                  <div>
                    <b>Strong Technical Skills</b>
                    <p>React, Java, and SQL are your strongest areas.</p>
                  </div>
                </div>

                <div className="career-insight">
                  <span>🚀</span>
                  <div>
                    <b>Job Ready</b>
                    <p>You are eligible for 8 recommended opportunities.</p>
                  </div>
                </div>
              </article>

              <article className="match-score-card">
                <h3>Job Match Score</h3>

                <div className="match-row">
                  <span>Frontend Developer</span>
                  <b>94%</b>
                </div>
                <div className="match-bar">
                  <div className="match-fill fill-94"></div>
                </div>

                <div className="match-row">
                  <span>Data Analyst</span>
                  <b>88%</b>
                </div>
                <div className="match-bar">
                  <div className="match-fill fill-88"></div>
                </div>

                <div className="match-row">
                  <span>UI/UX Designer</span>
                  <b>76%</b>
                </div>
                <div className="match-bar">
                  <div className="match-fill fill-76"></div>
                </div>

                <Link to="/job-matches">View Job Matches →</Link>
              </article>
            </section>

            <section className="application-section">
              <div className="application-heading">
                <div>
                  <p className="profile-kicker">APPLICATION TRACKER</p>
                  <h2>My Active Applications</h2>
                </div>

                <Link to="/job-matches">View All Jobs →</Link>
              </div>

              {applications.map((application) => (
                <article className="application-card" key={application.role}>
                  <div className="application-title-row">
                    <div>
                      <h3>{application.role}</h3>
                      <p>{application.company}</p>
                    </div>
                    <button>View Details →</button>
                  </div>

                  <div className="application-stages">
                    {application.stages.map((stage, index) => (
                      <div
                        className={`application-stage ${
                          index === application.activeStage ? "current-stage" : ""
                        }`}
                        key={stage[0]}
                      >
                        <b>{stage[1]}</b>
                        <span>{stage[0]}</span>
                        <div className="stage-line">
                          <div className={index <= application.activeStage ? "stage-fill" : ""}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CandidateProfile;
