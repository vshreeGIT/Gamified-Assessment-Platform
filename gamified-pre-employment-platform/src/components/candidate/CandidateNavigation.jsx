import { Link, NavLink } from "react-router-dom";
import { CandidateIcon } from "./CandidateIcon";

const navigation = [
  ["Dashboard", "/candidate-dashboard", "home"],
  ["Challenges", "/challenges", "target"],
  ["My Badges", "/badges", "shield"],
  ["Leaderboard", "/leaderboard", "award"],
  ["Job Matches", "/job-matches", "briefcase"],
  ["Profile", "/candidate-profile", "user"],
];

export default function CandidateNavigation({ active }) {
  return (
    <aside className="candidate-portal-sidebar">
      <Link className="candidate-portal-brand" to="/candidate-dashboard">
        <span className="candidate-portal-mark">SQ</span>
        <span><strong>SkillQuest</strong><small>Candidate Portal</small></span>
      </Link>
      <p className="candidate-portal-label">WORKSPACE</p>
      <nav className="candidate-portal-nav" aria-label="Candidate navigation">
        {navigation.map(([label, path, icon]) => (
          <NavLink
            key={path}
            to={path}
            className={active === path ? "candidate-portal-nav-item active" : "candidate-portal-nav-item"}
            aria-current={active === path ? "page" : undefined}
          >
            <CandidateIcon name={icon} />
            {label}
          </NavLink>
        ))}
      </nav>
      <Link className="candidate-portal-logout" to="/login">
        <CandidateIcon name="logout" />
        Logout
      </Link>
    </aside>
  );
}
