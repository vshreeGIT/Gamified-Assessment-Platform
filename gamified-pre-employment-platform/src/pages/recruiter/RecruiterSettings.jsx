import { useEffect, useState } from "react";
import { recruiterApi } from "../../services/recruiterService";
import RecruiterLayout from "./RecruiterLayout";

function RecruiterSettings() {
  const [settings, setSettings] = useState({ name: "", email: "", notificationsEnabled: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    recruiterApi
      .settings()
      .then((data) => {
        if (mounted) setSettings(data || settings);
      })
      .catch((loadError) => {
        if (mounted) setError(loadError.message || "Unable to load settings.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await recruiterApi.updateSettings(settings);
      setSettings(updated);
      setSuccess("Settings updated successfully.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RecruiterLayout
      headerLabel="SETTINGS"
      title="Recruiter settings"
      subtitle="Manage account preferences and notification settings."
    >
      {error ? <div className="rq-alert rq-alert-error">{error}</div> : null}
      {success ? <div className="rq-alert rq-alert-success">{success}</div> : null}

      {loading ? (
        <div className="rq-empty-state">Loading settings…</div>
      ) : (
        <section className="rq-panel">
          <form className="rq-form" onSubmit={handleSubmit}>
            <div className="rq-form-grid">
              <label>
                Full name
                <input name="name" value={settings.name || ""} onChange={updateField} required />
              </label>
              <label>
                Email address
                <input type="email" name="email" value={settings.email || ""} onChange={updateField} required />
              </label>
              <label className="checkbox-row">
                <input type="checkbox" name="notificationsEnabled" checked={Boolean(settings.notificationsEnabled)} onChange={updateField} />
                Enable email notifications
              </label>
            </div>

            <div className="rq-form-actions">
              <button className="rq-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</button>
            </div>
          </form>
        </section>
      )}
    </RecruiterLayout>
  );
}

export default RecruiterSettings;
