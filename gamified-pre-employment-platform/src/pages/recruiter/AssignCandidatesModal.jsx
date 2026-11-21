import { useEffect, useRef, useState } from "react";
import { recruiterApi, queryString } from "../../services/recruiterService";

const STYLES = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(3, 4, 28, 0.82)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
  },
  modal: {
    width: "100%", maxWidth: "560px", maxHeight: "90vh",
    display: "flex", flexDirection: "column",
    border: "1px solid rgba(130, 74, 255, 0.5)", borderRadius: "16px",
    background: "rgba(10, 10, 58, 0.97)",
    boxShadow: "0 0 60px rgba(100, 50, 255, 0.25)",
    overflow: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 22px 14px",
    borderBottom: "1px solid rgba(130, 74, 255, 0.2)",
  },
  title: { margin: 0, fontSize: "16px", color: "#f0ecff" },
  subtitle: { margin: "4px 0 0", color: "#8f89b7", fontSize: "11px" },
  closeBtn: {
    width: "30px", height: "30px", border: "1px solid rgba(130, 74, 255, 0.35)",
    borderRadius: "8px", background: "transparent", color: "#c0b8f0",
    fontSize: "16px", cursor: "pointer", display: "grid", placeItems: "center",
  },
  body: { flex: 1, overflowY: "auto", padding: "16px 22px" },
  searchInput: {
    width: "100%", boxSizing: "border-box", padding: "10px 12px",
    border: "1px solid rgba(151, 94, 255, 0.4)", borderRadius: "9px",
    background: "rgba(13, 12, 58, 0.9)", color: "white",
    fontSize: "13px", outline: "none", marginBottom: "12px",
  },
  list: { display: "flex", flexDirection: "column", gap: "6px" },
  row: (selected) => ({
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 12px", borderRadius: "9px", cursor: "pointer",
    border: `1px solid ${selected ? "rgba(130, 74, 255, 0.6)" : "rgba(130, 74, 255, 0.2)"}`,
    background: selected ? "rgba(100, 50, 255, 0.15)" : "rgba(255,255,255,0.03)",
    transition: "background 0.12s ease",
  }),
  checkbox: { width: "16px", height: "16px", accentColor: "#9c64ff", cursor: "pointer", flexShrink: 0 },
  avatar: {
    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
    display: "grid", placeItems: "center",
    background: "linear-gradient(135deg, #7844e8, #2fc6ff)",
    color: "white", fontSize: "11px", fontWeight: 700,
  },
  name: { margin: 0, color: "#f0ecff", fontSize: "13px", fontWeight: 600 },
  email: { margin: "2px 0 0", color: "#8f89b7", fontSize: "11px" },
  empty: { padding: "24px 0", textAlign: "center", color: "#8f89b7", fontSize: "13px" },
  footer: {
    padding: "14px 22px",
    borderTop: "1px solid rgba(130, 74, 255, 0.2)",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
  },
  selectedCount: { color: "#b998ff", fontSize: "12px" },
  confirmBtn: (disabled) => ({
    padding: "10px 20px", border: "none", borderRadius: "9px",
    background: disabled ? "rgba(100,50,255,0.3)" : "linear-gradient(135deg, #7845ff, #397ce8)",
    color: disabled ? "#7060a0" : "#fff",
    fontSize: "13px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
  }),
  cancelBtn: {
    padding: "10px 16px", border: "1px solid rgba(130, 74, 255, 0.35)",
    borderRadius: "9px", background: "transparent", color: "#c0b8f0",
    fontSize: "13px", cursor: "pointer",
  },
  alert: (type) => ({
    padding: "10px 14px", borderRadius: "9px", fontSize: "12px", marginBottom: "10px",
    border: `1px solid ${type === "error" ? "rgba(255,120,136,0.4)" : "rgba(76,222,153,0.4)"}`,
    background: type === "error" ? "rgba(116,24,34,0.32)" : "rgba(17,82,54,0.35)",
    color: type === "error" ? "#ffd7db" : "#d9ffeb",
  }),
};

export default function AssignCandidatesModal({ assessmentId, assessmentTitle, onClose, onAssigned }) {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState([]); // [{email, success, message}]
  const [done, setDone] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingList(true);
    recruiterApi
      .eligibleCandidates(assessmentId, search)
      .then((data) => { if (active) setCandidates(data.items || []); })
      .catch(() => { if (active) setCandidates([]); })
      .finally(() => { if (active) setLoadingList(false); });
    return () => { active = false; };
  }, [assessmentId, search]);

  function toggle(email) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  async function handleConfirm() {
    if (selected.size === 0 || submitting) return;
    setSubmitting(true);
    const emails = [...selected];
    // Snapshot names before the list potentially changes
    const emailToName = Object.fromEntries(candidates.map((c) => [c.email, c.name]));
    const settled = await Promise.allSettled(
      emails.map((email) => recruiterApi.assignCandidate(assessmentId, { email }))
    );
    const outcome = emails.map((email, i) => ({
      email,
      name: emailToName[email] || email,
      success: settled[i].status === "fulfilled",
      message: settled[i].status === "rejected"
        ? (settled[i].reason?.message || "Failed")
        : "Assigned successfully",
    }));
    setResults(outcome);
    setDone(true);
    setSubmitting(false);
    // Do NOT call onAssigned() here — calling it now triggers loadAssessment()
    // in the parent which sets loading=true, unmounting this modal before the
    // result screen can render. onAssigned is called in handleClose instead.
  }

  function handleClose() {
    // If any assignment succeeded, notify the parent to refresh its count
    // only at the moment the user dismisses the modal.
    if (done && results.some((r) => r.success)) {
      onAssigned();
    }
    onClose();
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div style={STYLES.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={STYLES.modal} role="dialog" aria-modal="true" aria-labelledby="assign-modal-title">
        <div style={STYLES.header}>
          <div>
            <h2 id="assign-modal-title" style={STYLES.title}>Assign Candidates</h2>
            <p style={STYLES.subtitle}>{assessmentTitle}</p>
          </div>
          <button style={STYLES.closeBtn} type="button" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        <div style={STYLES.body}>
          {done ? (
            <>
              {successCount > 0 && (
                <div style={STYLES.alert("success")}>
                  ✅ {successCount} candidate{successCount > 1 ? "s" : ""} assigned successfully:
                  <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    {results.filter((r) => r.success).map((r) => (
                      <li key={r.email} style={{ marginTop: "4px" }}>{r.name} ({r.email})</li>
                    ))}
                  </ul>
                </div>
              )}
              {failCount > 0 && (
                <div style={STYLES.alert("error")}>
                  ⚠️ {failCount} assignment{failCount > 1 ? "s" : ""} failed:
                  <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    {results.filter((r) => !r.success).map((r) => (
                      <li key={r.email} style={{ marginTop: "4px" }}>{r.email} — {r.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <input
                ref={searchRef}
                style={STYLES.searchInput}
                type="search"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {loadingList ? (
                <div style={STYLES.empty}>Loading candidates…</div>
              ) : candidates.length === 0 ? (
                <div style={STYLES.empty}>
                  {search ? "No candidates match your search." : "All registered candidates are already assigned to this assessment."}
                </div>
              ) : (
                <div style={STYLES.list}>
                  {candidates.map((c) => {
                    const isSelected = selected.has(c.email);
                    const initials = (c.name || c.email).split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <div key={c.email} style={STYLES.row(isSelected)} onClick={() => toggle(c.email)}>
                        <input
                          type="checkbox"
                          style={STYLES.checkbox}
                          checked={isSelected}
                          onChange={() => toggle(c.email)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${c.name}`}
                        />
                        <div style={STYLES.avatar}>{initials}</div>
                        <div>
                          <p style={STYLES.name}>{c.name}</p>
                          <p style={STYLES.email}>{c.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <div style={STYLES.footer}>
          {done ? (
            <button style={STYLES.cancelBtn} type="button" onClick={handleClose}>Close</button>
          ) : (
            <>
              <span style={STYLES.selectedCount}>
                {selected.size > 0 ? `${selected.size} selected` : "Select candidates to assign"}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={STYLES.cancelBtn} type="button" onClick={handleClose} disabled={submitting}>Cancel</button>
                <button
                  style={STYLES.confirmBtn(selected.size === 0 || submitting)}
                  type="button"
                  onClick={handleConfirm}
                  disabled={selected.size === 0 || submitting}
                >
                  {submitting ? "Assigning…" : `Assign ${selected.size > 0 ? `(${selected.size})` : ""}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
