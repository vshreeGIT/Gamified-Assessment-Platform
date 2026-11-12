import { useEffect, useState } from "react";
import { recruiterApi } from "../../services/recruiterService";
import RecruiterLayout from "./RecruiterLayout";

function RecruiterAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalAssessments: 0,
    assignedCandidates: 0,
    completionRate: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    scoreDistribution: [],
    technologyPerformance: [],
    assessmentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    recruiterApi
      .analytics()
      .then((data) => {
        if (mounted) {
          setAnalytics(data || {});
        }
      })
      .catch((loadError) => {
        if (mounted) setError(loadError.message || "Unable to load analytics data.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const maxScoreCount = Math.max(...(analytics.scoreDistribution || []).map((entry) => entry.count), 1);
  const maxTechnologyScore = Math.max(...(analytics.technologyPerformance || []).map((entry) => entry.averageScore), 1);

  return (
    <RecruiterLayout
      headerLabel="ANALYTICS"
      title="Recruitment analytics"
      subtitle="Track score trends, technology performance and assessment throughput."
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}

      {loading ? (
        <div className="rq-empty-state">Loading analytics…</div>
      ) : (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon purple">▤</div>
              <div>
                <p>Total assessments</p>
                <h2>{analytics.totalAssessments ?? 0}</h2>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon blue">♙</div>
              <div>
                <p>Assigned candidates</p>
                <h2>{analytics.assignedCandidates ?? 0}</h2>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon green">✓</div>
              <div>
                <p>Completion rate</p>
                <h2>{analytics.completionRate ?? 0}%</h2>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon pink">★</div>
              <div>
                <p>Average score</p>
                <h2>{analytics.averageScore ?? 0}%</h2>
              </div>
            </article>
          </section>

          <section className="middle-grid">
            <article className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>📈 Score distribution</h2>
                  <p>Candidate performance range</p>
                </div>
              </div>
              <div className="distribution-bars">
                {(analytics.scoreDistribution || []).length > 0 ? (
                  analytics.scoreDistribution.map(({ label, count }) => (
                    <div className="distribution-item" key={label}>
                      <div className="distribution-meta">
                        <span>{label}</span>
                        <strong>{count}</strong>
                      </div>
                      <div className="distribution-track">
                        <span style={{ width: `${(count / maxScoreCount) * 100}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rq-empty-state">No score distribution data.</div>
                )}
              </div>
            </article>

            <article className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>🧠 Technology performance</h2>
                  <p>Average score by technology</p>
                </div>
              </div>
              <div className="technology-list">
                {(analytics.technologyPerformance || []).length > 0 ? (
                  analytics.technologyPerformance.map((entry) => (
                    <div className="technology-row" key={entry.technology}>
                      <div className="technology-labels">
                        <span>{entry.technology}</span>
                        <strong>{entry.averageScore ?? 0}%</strong>
                      </div>
                      <div className="distribution-track">
                        <span style={{ width: `${((entry.averageScore || 0) / maxTechnologyScore) * 100}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rq-empty-state">No technology performance data.</div>
                )}
              </div>
            </article>
          </section>

          <section className="rq-panel">
            <div className="rq-section-header">
              <h2>Assessment activity</h2>
            </div>
            <div className="rq-table-wrap">
              <table className="rq-table">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Technology</th>
                    <th>Assigned</th>
                    <th>Completed</th>
                    <th>Average score</th>
                  </tr>
                </thead>
                <tbody>
                  {(analytics.assessmentActivity || []).map((item) => (
                    <tr key={item.assessmentName}>
                      <td>{item.assessmentName}</td>
                      <td>{item.technology}</td>
                      <td>{item.assigned ?? 0}</td>
                      <td>{item.completed ?? 0}</td>
                      <td>{item.averageScore ?? 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </RecruiterLayout>
  );
}

export default RecruiterAnalytics;
