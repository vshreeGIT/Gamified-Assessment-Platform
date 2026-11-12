import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterApi } from "../../services/recruiterService";
import RecruiterLayout from "./RecruiterLayout";

const fallbackMetrics = {
  totalAssessments: 0,
  activeAssessments: 0,
  totalCandidates: 0,
  completedAttempts: 0,
  completionRate: 0,
  averageScore: 0,
};

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({ metrics: fallbackMetrics, recentAssessments: [], recentActivity: [], scoreDistribution: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    recruiterApi
      .dashboard()
      .then((data) => {
        if (mounted) {
          setDashboard({
            metrics: data?.metrics || fallbackMetrics,
            recentAssessments: data?.recentAssessments || [],
            recentActivity: data?.recentActivity || [],
            scoreDistribution: data?.scoreDistribution || [],
          });
          setError("");
        }
      })
      .catch((fetchError) => {
        if (mounted) setError(fetchError.message || "Unable to load dashboard data.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { icon: "▤", tone: "purple", label: "Total Assessments", value: dashboard.metrics.totalAssessments ?? 0, trend: "active pipeline" },
      { icon: "♙", tone: "blue", label: "Active Assessments", value: dashboard.metrics.activeAssessments ?? 0, trend: "published" },
      { icon: "✓", tone: "green", label: "Total Candidates", value: dashboard.metrics.totalCandidates ?? 0, trend: "in review" },
      { icon: "★", tone: "pink", label: "Completed Attempts", value: dashboard.metrics.completedAttempts ?? 0, trend: `${dashboard.metrics.completionRate ?? 0}% completion` },
      { icon: "◎", tone: "blue", label: "Completion Rate", value: `${dashboard.metrics.completionRate ?? 0}%`, trend: "progress" },
      { icon: "▣", tone: "purple", label: "Average Score", value: `${dashboard.metrics.averageScore ?? 0}%`, trend: "overall" },
    ],
    [dashboard],
  );

  const quickActions = [
    { label: "Create Assessment", description: "Build a new coding or aptitude test", icon: "＋", path: "/recruiter/assessments/create", tone: "purple" },
    { label: "Manage Assessments", description: "Review published and draft tests", icon: "▤", path: "/recruiter/assessments", tone: "blue" },
    { label: "View Candidates", description: "Inspect candidate performance", icon: "♙", path: "/recruiter/candidates", tone: "green" },
    { label: "Results", description: "Compare score rankings", icon: "◈", path: "/recruiter/results", tone: "pink" },
    { label: "Analytics", description: "Track trends and insights", icon: "▥", path: "/recruiter/analytics", tone: "purple" },
  ];

  const maxHistogram = Math.max(...dashboard.scoreDistribution.map((item) => item.count), 1);

  return (
    <RecruiterLayout
      headerLabel="RECRUITER DASHBOARD"
      title="Welcome back, Recruiter"
      subtitle="Manage assessments, evaluate candidates and track recruitment performance."
      actions={
        <button className="rq-button" type="button" onClick={() => navigate("/recruiter/assessments/create")}>
          + New Assessment
        </button>
      }
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}

      {loading ? (
        <div className="rq-empty-state">Loading recruiter dashboard…</div>
      ) : (
        <>
          <section className="stats-grid" aria-label="Recruitment statistics">
            {stats.map(({ icon, tone, label, value, trend }) => (
              <article className="stat-card" key={label}>
                <div className={`stat-icon ${tone}`}>{icon}</div>
                <div>
                  <p>{label}</p>
                  <h2>{value}</h2>
                  <span className="growth">↗ {trend}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="quick-section">
            <div className="section-title">
              <h2>⚡ Quick Actions</h2>
              <p>Manage your recruitment workflow</p>
            </div>
            <div className="quick-grid">
              {quickActions.map(({ label, description, icon, path, tone }) => (
                <button key={label} className="quick-card" type="button" onClick={() => navigate(path)}>
                  <span className={`quick-icon ${tone}`}>{icon}</span>
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <b className="quick-arrow">→</b>
                </button>
              ))}
            </div>
          </section>

          <section className="middle-grid">
            <article className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>🏆 Recent Assessments</h2>
                  <p>Your latest assessment activities</p>
                </div>
                <button type="button" onClick={() => navigate("/recruiter/assessments")}>
                  View All →
                </button>
              </div>

              <div className="assessment-table">
                <div className="assessment-header">
                  <span>Assessment</span>
                  <span>Type</span>
                  <span>Assigned</span>
                  <span>Avg. Score</span>
                  <span>Status</span>
                </div>

                {dashboard.recentAssessments.length > 0 ? (
                  dashboard.recentAssessments.map((assessment) => (
                    <div className="assessment-row" key={assessment.id} onClick={() => navigate(`/recruiter/assessments/${assessment.id}`)}>
                      <div className="assessment-name">
                        <span className="assessment-letter">{assessment.title?.charAt(0) || "A"}</span>
                        <span>{assessment.title}</span>
                      </div>
                      <span>{assessment.type}</span>
                      <span>{assessment.assignedCandidates ?? assessment.assigned ?? 0}</span>
                      <span>{assessment.averageScore ?? 0}%</span>
                      <span className={`status ${assessment.status?.toLowerCase() || "draft"}`}>{assessment.status || "draft"}</span>
                    </div>
                  ))
                ) : (
                  <div className="rq-empty-state">No assessments available.</div>
                )}
              </div>
            </article>

            <article className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>📊 Score Distribution</h2>
                  <p>Candidate performance overview</p>
                </div>
                <span className="month">Current cycle</span>
              </div>

              <div className="distribution-bars">
                {dashboard.scoreDistribution.length > 0 ? (
                  dashboard.scoreDistribution.map(({ label, count }) => (
                    <div className="distribution-item" key={label}>
                      <div className="distribution-meta">
                        <span>{label}</span>
                        <strong>{count}</strong>
                      </div>
                      <div className="distribution-track">
                        <span style={{ width: `${(count / maxHistogram) * 100}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rq-empty-state">Score distribution is unavailable.</div>
                )}
              </div>
            </article>
          </section>

          <section className="dashboard-panel candidates-panel">
            <div className="panel-heading">
              <div>
                <h2>👥 Recent Candidate Activity</h2>
                <p>Latest completed assessments and outcomes</p>
              </div>
              <button type="button" onClick={() => navigate("/recruiter/candidates")}>
                View All →
              </button>
            </div>

            <div className="candidate-table">
              <div className="candidate-header">
                <span>Candidate</span>
                <span>Assessment</span>
                <span>Score</span>
                <span>Decision</span>
                <span>Action</span>
              </div>
              {dashboard.recentActivity.length > 0 ? (
                dashboard.recentActivity.map((candidate) => (
                  <div className="candidate-row" key={`${candidate.candidateId || candidate.candidateName}-${candidate.assessmentId || candidate.id}`}>
                    <div className="candidate-profile">
                      <span className="candidate-avatar">{(candidate.candidateName || "C").split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                      <span>
                        <strong>{candidate.candidateName || "Candidate"}</strong>
                        <small>{candidate.assessmentName || "Assessment"}</small>
                      </span>
                    </div>
                    <span>{candidate.assessmentName || "Assessment"}</span>
                    <span className="candidate-score">
                      <strong>{candidate.score ?? candidate.percentage ?? 0}%</strong>
                    </span>
                    <span className={`candidate-status ${candidate.decision || "review"}`}>{candidate.decision || "Review"}</span>
                    <button className="view-profile" type="button" onClick={() => navigate(`/recruiter/candidates/${candidate.candidateId || ""}`)}>
                      View
                    </button>
                  </div>
                ))
              ) : (
                <div className="rq-empty-state">No recent activity available.</div>
              )}
            </div>
          </section>
        </>
      )}
    </RecruiterLayout>
  );
}

export default RecruiterDashboard;
