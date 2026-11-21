import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { applyToJob, getJobMatches, getMyJobApplications, getProfileStrength, saveJob, unsaveJob } from "../../services/jobService";
import { isAuthenticated, logoutUser } from "../../services/authService";
import "../../styles/JobMatches.css";

const FILTERS = ["All Matches", "Internships", "Full Time", "Remote"];

function matchesFilter(job, filter) {
  if (filter === "All Matches") return true;
  if (filter === "Internships") return job.employmentType === "Internship";
  if (filter === "Full Time") return job.employmentType === "Full Time";
  if (filter === "Remote") return job.workMode === "Remote";
  return true;
}

function matchesSearch(job, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    job.title?.toLowerCase().includes(q) ||
    job.company?.toLowerCase().includes(q) ||
    job.location?.toLowerCase().includes(q) ||
    job.requiredSkills?.some((s) => s.toLowerCase().includes(q)) ||
    job.preferredSkills?.some((s) => s.toLowerCase().includes(q))
  );
}

export default function JobMatches() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [profileStrength, setProfileStrength] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All Matches");
  const [search, setSearch] = useState("");
  const [minMatch, setMinMatch] = useState(0);

  const [savingIds, setSavingIds] = useState(new Set());
  const [saveError, setSaveError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeView, setActiveView] = useState("jobs");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");

  // ── load data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const [jobsData, strengthData, applicationsData] = await Promise.all([
        getJobMatches(),
        getProfileStrength(),
        getMyJobApplications(),
      ]);
      setJobs(jobsData || []);
      setProfileStrength(strengthData);
      setApplications(applicationsData || []);
    } catch (err) {
      if (
        err.message?.toLowerCase().includes("401") ||
        err.message?.toLowerCase().includes("unauthorized")
      ) {
        logoutUser();
        navigate("/login");
      } else {
        setError(err.message || "Failed to load job matches.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── save / unsave ──────────────────────────────────────────────────────────
  async function handleSaveToggle(job) {
    if (savingIds.has(job.id)) return;
    setSavingIds((prev) => new Set(prev).add(job.id));
    setSaveError("");
    try {
      if (job.saved) {
        await unsaveJob(job.id);
      } else {
        await saveJob(job.id);
      }
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, saved: !j.saved } : j))
      );
      if (selectedJob?.id === job.id) {
        setSelectedJob((prev) => ({ ...prev, saved: !prev.saved }));
      }
    } catch (err) {
      setSaveError(
        job.saved
          ? `Could not unsave "${job.title}": ${err.message}`
          : `Could not save "${job.title}": ${err.message}`
      );
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  }

  async function handleApply(job) {
    if (!job.canApply || job.applied || applying) return;
    setApplying(true);
    setApplyError("");
    try {
      const application = await applyToJob(job.id);
      setApplications((current) => [application, ...current.filter((item) => item.id !== application.id)]);
      setApplyError("");
      const updatedJob = { ...job, applied: true, applicationStatus: application.status };
      setJobs((current) => current.map((item) => item.id === job.id ? updatedJob : item));
      setSelectedJob(updatedJob);
    } catch (requestError) {
      setApplyError(requestError.message || "Unable to apply for this job.");
    } finally {
      setApplying(false);
    }
  }

  // ── filtering ──────────────────────────────────────────────────────────────
  const filtered = jobs
    .filter((j) => matchesFilter(j, activeFilter))
    .filter((j) => matchesSearch(j, search))
    .filter((j) => j.matchScore >= minMatch);

  // ── profile strength ───────────────────────────────────────────────────────
  const strength = profileStrength?.strength ?? 0;
  const verifiedSkillScoresAvailable = jobs.some((job) => job.skillBreakdown?.some((skill) => skill.candidateScore !== null));

  // ── render ─────────────────────────────────────────────────────────────────
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

        <button
          className="job-logout"
          onClick={() => {
            logoutUser();
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>
      </aside>

      <main className="job-main">
        <header className="job-header">
          <div>
            <p className="job-small-title">CAREER QUEST</p>
            <h1>Your Job Matches 💼</h1>
            <p>
              Recommendations use verified challenge and assessment scores weighted against each job’s required skills.
            </p>
          </div>

          <div
            className="job-profile-score"
            title="Based on profile completeness (name, email, phone, college, department)"
          >
            <span>Profile Strength</span>
            <b
              style={{
                color:
                  strength >= 80
                    ? "#61ef91"
                    : strength >= 40
                    ? "#ffd84c"
                    : "#f87171",
              }}
            >
              {loading ? "…" : `${strength}%`}
            </b>
          </div>
        </header>

        {/* Profile incomplete warning */}
        {profileStrength && !verifiedSkillScoresAvailable && (
          <div className="job-profile-warning" role="alert">
            <span>⚠️</span>
            <div>
              <b>No verified skill scores are available yet.</b> Unrated job requirements contribute zero to match scores. Complete scored challenges or recruiter assessments to build evidence.
            </div>
          </div>
        )}

        {/* Challenges banner */}
        <section className="job-insight-card">
          <div className="job-insight-icon">✨</div>
          <div>
            <h3>You have strong matches waiting!</h3>
            <p>
              Complete more challenges to earn XP and improve your match scores.
            </p>
          </div>
          <Link to="/challenges">View Challenges</Link>
        </section>

        <div className="job-view-tabs" role="group" aria-label="Job views">
          <button type="button" className={activeView === "jobs" ? "active" : ""}
            onClick={() => { setActiveView("jobs"); document.getElementById("job-search-row")?.scrollIntoView({ behavior: "smooth" }); }}>
            Find jobs
          </button>
          <button type="button" className={activeView === "applications" ? "active" : ""}
            onClick={() => { setActiveView("applications"); document.getElementById("my-applications")?.scrollIntoView({ behavior: "smooth" }); }}>
            My applications · {applications.length}
          </button>
        </div>

        {/* Load error */}
        {error && (
          <div className="job-error-banner" role="alert">
            ⚠️ {error}{" "}
            <button onClick={loadData} className="job-retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Save error */}
        {saveError && (
          <div className="job-error-banner" role="alert">
            ⚠️ {saveError}{" "}
            <button
              onClick={() => setSaveError("")}
              className="job-retry-btn"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search + filter row */}
        <div className="job-search-row" id="job-search-row">
          <input
            className="job-search-input"
            type="search"
            placeholder="Search by title, company, or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search jobs"
          />
          <label className="job-min-match-label">
            Min match:
            <select
              className="job-min-match-select"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              aria-label="Minimum match percentage"
            >
              <option value={0}>Any</option>
              <option value={50}>50%+</option>
              <option value={70}>70%+</option>
              <option value={85}>85%+</option>
            </select>
          </label>
        </div>

        <section
          className="job-filter-row"
          role="group"
          aria-label="Job type filters"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              className={activeFilter === f ? "job-filter-active" : ""}
              onClick={() => setActiveFilter(f)}
              aria-pressed={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Loading skeleton */}
        {loading && (
          <div className="job-loading" aria-live="polite">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="job-card job-card-skeleton"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="job-empty">
            <span>🔍</span>
            <p>No jobs match your current filters.</p>
            <button
              onClick={() => {
                setActiveFilter("All Matches");
                setSearch("");
                setMinMatch(0);
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Job grid */}
        {!loading && filtered.length > 0 && (
          <section className="job-grid">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saving={savingIds.has(job.id)}
                onSave={() => handleSaveToggle(job)}
                onView={() => setSelectedJob(job)}
              />
            ))}
          </section>
        )}

        <section className="job-applications-section" id="my-applications">
          <div className="job-applications-heading">
            <div><p className="job-small-title">YOUR RECRUITMENT ACTIVITY</p><h2>My applications</h2></div>
            <div className="job-applications-refresh"><span>{applications.length} submitted</span><button type="button" onClick={loadData}>Refresh status</button></div>
          </div>
          {applications.length === 0 ? (
            <div className="job-empty job-applications-empty">You have not applied to any recruiter-managed jobs yet.</div>
          ) : (
            <div className="job-application-list">
              {applications.map((application) => (
                <article className="job-application-row" key={application.id}>
                  <div className="job-application-title"><b>{application.jobTitle}</b><span>{application.company}</span></div>
                  <span className={`job-application-status ${application.status?.toLowerCase() || "applied"}`}>
                    {application.status?.replaceAll("_", " ") || "APPLIED"}
                  </span>
                  <span className="job-application-match">{application.matchScore}% match</span>
                  <time>{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : "—"}</time>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* XP progress card */}
        {profileStrength && (
          <section className="job-progress-card">
            <div className="job-progress-left">
              <div className="job-progress-icon">🎯</div>
              <div>
                <p>Unlock More Matches</p>
                <h2>Complete challenges to increase your skill score.</h2>
              </div>
            </div>

            <div className="job-progress-right">
              <span>
                Next skill unlock at{" "}
                {Math.ceil((profileStrength.xp + 1) / 100) * 100} XP
              </span>
              <div className="job-progress-bar">
                <div
                  className="job-progress-fill"
                  style={{
                    width: `${Math.min(100, profileStrength.xp % 100)}%`,
                  }}
                />
              </div>
              <b>{profileStrength.xp} XP earned</b>
            </div>
          </section>
        )}
      </main>

      {/* Job detail modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          saving={savingIds.has(selectedJob.id)}
          onSave={() => handleSaveToggle(selectedJob)}
          onApply={() => handleApply(selectedJob)}
          applying={applying}
          applyError={applyError}
          onClose={() => setSelectedJob(null)}
          profileStrength={profileStrength}
        />
      )}
    </div>
  );
}

// ── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job, saving, onSave, onView }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className={`company-logo ${job.logoColor || "blue"}`}>
          {job.companyLogo || "💼"}
        </div>
        <div className="job-match-score">
          <span>Match</span>
          <b>{job.matchScore}%</b>
        </div>
      </div>
      {job.applied && <span className="job-applied-chip">Applied · {job.applicationStatus?.replaceAll("_", " ") || "APPLIED"}</span>}

      <p className="company-name">{job.company}</p>
      <h2>{job.title}</h2>

      <div className="job-details">
        <span>📍 {job.location}</span>
        <span>⏳ {job.employmentType}</span>
        {job.salary && <span>💰 {job.salary}</span>}
      </div>

      <div className="job-skills">
        {(job.requiredSkills || []).slice(0, 4).map((skill) => (
          <span
            key={skill}
            className={
              job.matchedSkills?.includes(skill) ? "skill-matched" : ""
            }
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="job-card-bottom">
        <button
          className={`save-job-btn${job.saved ? " saved" : ""}`}
          onClick={onSave}
          disabled={saving}
          aria-label={job.saved ? `Unsave ${job.title}` : `Save ${job.title}`}
        >
          {saving ? "…" : job.saved ? "♥ Saved" : "♡ Save"}
        </button>
        <button
          className="apply-job-btn"
          onClick={onView}
          aria-label={`View details for ${job.title}`}
        >
          View Job →
        </button>
      </div>
    </article>
  );
}

// ── Job detail modal ──────────────────────────────────────────────────────────
function JobDetailModal({ job, saving, onSave, onApply, applying, applyError, onClose, profileStrength }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="job-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={job.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="job-modal">
        <button
          className="job-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="job-modal-header">
          <div
            className={`company-logo ${job.logoColor || "blue"}`}
            style={{ fontSize: 32, width: 64, height: 64 }}
          >
            {job.companyLogo || "💼"}
          </div>
          <div>
            <p className="company-name" style={{ margin: "0 0 4px" }}>
              {job.company}
            </p>
            <h2 style={{ margin: 0, fontSize: 22 }}>{job.title}</h2>
          </div>
          <div className="job-match-score" style={{ marginLeft: "auto" }}>
            <span>Match</span>
            <b>{job.matchScore}%</b>
          </div>
        </div>

        {/* Meta */}
        <div className="job-details" style={{ marginTop: 16 }}>
          <span>📍 {job.location}</span>
          <span>🌐 {job.workMode}</span>
          <span>⏳ {job.employmentType}</span>
          {job.salary && <span>💰 {job.salary}</span>}
          {job.experienceLevel && <span>🎓 {job.experienceLevel}</span>}
          {job.minimumExperienceYears > 0 && <span>Minimum {job.minimumExperienceYears} years</span>}
        </div>

        {/* Sample listing notice */}
        {!job.canApply && !job.applicationUrl && (
          <div className="job-sample-notice" style={{ marginTop: 12 }}>
            Informational listing · applications are not managed through SkillQuest.
          </div>
        )}

        {/* Description */}
        {job.description && (
          <div className="job-modal-section">
            <h3>About the Role</h3>
            <p style={{ color: "#d5cff1", lineHeight: 1.6 }}>
              {job.description}
            </p>
          </div>
        )}

        {/* Required skills with match/missing indicators */}
        {job.requiredSkills?.length > 0 && (
          <div className="job-modal-section">
            <h3>Required Skills</h3>
            <div className="job-skills">
              {job.requiredSkills.map((s) => (
                <span
                  key={s}
                  className={
                    job.matchedSkills?.includes(s)
                      ? "skill-matched"
                      : "skill-missing"
                  }
                >
                  {job.matchedSkills?.includes(s) ? "✓ " : "✗ "}
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferred skills */}
        {job.preferredSkills?.length > 0 && (
          <div className="job-modal-section">
            <h3>Preferred Skills</h3>
            <div className="job-skills">
              {job.preferredSkills.map((s) => (
                <span
                  key={s}
                  className={
                    job.matchedSkills?.includes(s) ? "skill-matched" : ""
                  }
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills to develop */}
        {job.missingSkills?.length > 0 && (
          <div className="job-modal-section">
            <h3>Unassessed required skills</h3>
            <p style={{ color: "#cbc6ec", fontSize: 13, margin: "0 0 8px" }}>
              No scored challenge or assessment evidence is available for these skills yet. They receive zero match credit.
            </p>
            <div className="job-skills">
              {job.missingSkills.map((s) => (
                <span key={s} className="skill-missing">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.skillGaps?.length > 0 && (
          <div className="job-modal-section">
            <h3>Skill gaps</h3>
            <div className="job-skills">
              {job.skillGaps.map((skill) => {
                const evidence = job.skillBreakdown?.find((item) => item.skill === skill);
                return <span key={skill} className="skill-missing">{skill} · {evidence?.candidateScore ?? "Unrated"}{evidence?.candidateScore !== null && evidence?.candidateScore !== undefined ? "%" : ""}</span>;
              })}
            </div>
          </div>
        )}

        {job.skillBreakdown?.length > 0 && (
          <div className="job-modal-section">
            <h3>Verified skill evidence</h3>
            <p className="job-match-basis-text">{job.matchExplanation}</p>
            <div className="job-skill-breakdown">
              {job.skillBreakdown.map((item) => (
                <div className="job-skill-breakdown-row" key={item.skill}>
                  <span>{item.skill}<small>Weight {item.weight}</small></span>
                  <b>{item.candidateScore === null ? "Unrated" : `${item.candidateScore}%`}</b>
                  <small>{item.evidence}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match basis — explains how the score was calculated */}
        {profileStrength && (
          <div className="job-modal-section job-match-basis">
            <h3>How your match was calculated</h3>
            <p className="job-match-basis-text">
              {job.matchExplanation || "Verified challenge and assessment scores are compared with job skill weights; unrated skills contribute zero."}
            </p>
            {profileStrength.inferredSkills?.length > 0 && (
              <>
                <p
                  style={{
                    color: "#cbc6ec",
                    fontSize: 12,
                    margin: "8px 0 6px",
                  }}
                >
                  Your current skill set ({profileStrength.inferredSkills.length} skills):
                </p>
                <div className="job-skills">
                  {profileStrength.inferredSkills.map((s) => (
                    <span key={s} className="skill-inferred">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
            {!profileStrength.hasSkills && (
              <p className="job-match-basis-warning">
                ⚠️ Add self-declared skills in your{" "}
                <Link to="/candidate-profile" className="job-profile-warning-link">
                  profile
                </Link>{" "}
                to get accurate match scores.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="job-modal-actions">
          <button
            className={`save-job-btn${job.saved ? " saved" : ""}`}
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "…" : job.saved ? "♥ Saved" : "♡ Save"}
          </button>

          {job.canApply ? (
            <button
              className="apply-job-btn"
              onClick={onApply}
              disabled={applying || job.applied}
            >
              {applying ? "Submitting…" : job.applied ? `Applied · ${job.applicationStatus?.replaceAll("_", " ") || "APPLIED"}` : "Apply through SkillQuest"}
            </button>
          ) : job.applicationUrl ? (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="apply-job-btn"
              style={{
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Apply Now ↗
            </a>
          ) : (
            <div className="job-no-apply-notice">
              This listing does not accept applications through SkillQuest.
            </div>
          )}
        </div>
        {applyError && <p className="job-error-banner" role="alert">{applyError}</p>}
      </div>
    </div>
  );
}
