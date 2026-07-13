import { Link } from "react-router-dom";
import "../../styles/JobMatches.css";

function JobMatches() {
  const jobs = [
    {
      company: "TechNova Solutions",
      logo: "💻",
      role: "Frontend Developer Intern",
      location: "Chennai, Tamil Nadu",
      type: "Internship",
      match: 94,
      skills: ["React", "JavaScript", "HTML/CSS"],
      salary: "₹15,000 / month",
      color: "blue",
    },
    {
      company: "DataSphere Analytics",
      logo: "📊",
      role: "Data Analyst Intern",
      location: "Bengaluru, Karnataka",
      type: "Internship",
      match: 88,
      skills: ["Python", "SQL", "Power BI"],
      salary: "₹18,000 / month",
      color: "purple",
    },
    {
      company: "CloudNest Technologies",
      logo: "☁️",
      role: "Junior Software Engineer",
      location: "Remote",
      type: "Full Time",
      match: 82,
      skills: ["Java", "Git", "Problem Solving"],
      salary: "₹4.5 LPA",
      color: "cyan",
    },
    {
      company: "BrightPath Digital",
      logo: "🚀",
      role: "UI/UX Design Intern",
      location: "Chennai, Tamil Nadu",
      type: "Internship",
      match: 76,
      skills: ["Figma", "Canva", "UI Design"],
      salary: "₹12,000 / month",
      color: "pink",
    },
  ];

  return (
    <div className="job-page">
      <aside className="job-sidebar">
        <div className="job-logo">
          🛡️ Skill<span>Quest</span>
        </div>

        <nav className="job-menu">
          <Link to="/candidate-dashboard">🏠 Dashboard</Link>
          <Link to="/challenges">🎯 Challenges</Link>
          <Link to="/badges">🛡️ My Badges</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
          <Link to="/job-matches" className="job-active">
            💼 Job Matches
          </Link>
          <Link to="/candidate-profile">👤 Profile</Link>
        </nav>

        <Link to="/" className="job-logout">
          🚪 Logout
        </Link>
      </aside>

      <main className="job-main">
        <header className="job-header">
          <div>
            <p className="job-small-title">CAREER QUEST</p>
            <h1>Your Job Matches 💼</h1>
            <p>
              These opportunities are matched using your skills, badges, and
              challenge performance.
            </p>
          </div>

          <div className="job-profile-score">
            <span>Profile Strength</span>
            <b>78%</b>
          </div>
        </header>

        <section className="job-insight-card">
          <div className="job-insight-icon">✨</div>
          <div>
            <h3>You have strong matches waiting!</h3>
            <p>
              Complete 2 more JavaScript challenges to improve your Frontend
              Developer match score.
            </p>
          </div>
          <Link to="/challenges">View Challenges</Link>
        </section>

        <section className="job-filter-row">
          <button className="job-filter-active">All Matches</button>
          <button>Internships</button>
          <button>Full Time</button>
          <button>Remote</button>
        </section>

        <section className="job-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.role}>
              <div className="job-card-top">
                <div className={`company-logo ${job.color}`}>{job.logo}</div>

                <div className="job-match-score">
                  <span>Match</span>
                  <b>{job.match}%</b>
                </div>
              </div>

              <p className="company-name">{job.company}</p>
              <h2>{job.role}</h2>

              <div className="job-details">
                <span>📍 {job.location}</span>
                <span>⏳ {job.type}</span>
                <span>💰 {job.salary}</span>
              </div>

              <div className="job-skills">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <div className="job-card-bottom">
                <button className="save-job-btn">♡ Save</button>
                <button className="apply-job-btn">View Job →</button>
              </div>
            </article>
          ))}
        </section>

        <section className="job-progress-card">
          <div className="job-progress-left">
            <div className="job-progress-icon">🎯</div>
            <div>
              <p>Unlock More Matches</p>
              <h2>Complete challenges to increase your skill score.</h2>
            </div>
          </div>

          <div className="job-progress-right">
            <span>Next unlock at 500 XP</span>
            <div className="job-progress-bar">
              <div className="job-progress-fill"></div>
            </div>
            <b>320 / 500 XP</b>
          </div>
        </section>
      </main>
    </div>
  );
}

export default JobMatches;
