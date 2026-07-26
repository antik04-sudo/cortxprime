import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";
import { listMyKids } from "../../db/supabase/kidsRepo";
import { listEntriesForProfile } from "../../db/supabase/entriesRepo";
import type { KidProfile, SupabaseJournalEntry } from "../../types";
import AddKidForm from "./AddKidForm";

const MAX_KIDS = 2;

export default function ParentDashboard() {
  const { user, isAdmin, signOut } = useParentAuth();
  const navigate = useNavigate();

  const [kids, setKids] = useState<KidProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKid, setSelectedKid] = useState<KidProfile | null>(null);
  const [entries, setEntries] = useState<SupabaseJournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await listMyKids();
    setKids(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleSignOut() {
    await signOut();
    navigate("/parent/login");
  }

  async function handleSelectKid(kid: KidProfile) {
    setSelectedKid(kid);
    setEntriesLoading(true);
    const data = await listEntriesForProfile(kid.id);
    setEntries(data);
    setEntriesLoading(false);
  }

  if (selectedKid) {
    return (
      <div className="screen">
        <button
          type="button"
          onClick={() => setSelectedKid(null)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "var(--text-sm)",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          ← Back to your family
        </button>
        <h1 style={{ fontSize: "var(--text-xl)" }}>{selectedKid.username}'s entries</h1>

        {entriesLoading ? (
          <p className="text-secondary">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-secondary">No entries yet.</p>
        ) : (
          <div className="stack">
            {entries.map((entry) => (
              <div key={entry.id} className="card">
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)" }}
                  className="text-secondary"
                >
                  <span>{entry.entryType.replace(/_/g, " ")}</span>
                  <span>{entry.context ?? "—"}</span>
                </div>
                <p style={{ fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                {entry.feltWord && (
                  <p style={{ fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>
                    Felt: {entry.feltWord}
                  </p>
                )}
                <div className="stack" style={{ marginTop: "var(--space-3)" }}>
                  {[entry.answers.q1, entry.answers.q2, entry.answers.q3]
                    .filter(Boolean)
                    .map((answer, i) => (
                      <p key={i} style={{ fontSize: "var(--text-sm)" }}>
                        {answer}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "var(--text-xl)" }}>Your family</h1>
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "var(--text-sm)",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>

      <p className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
        {user?.email}
      </p>

      {isAdmin && (
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={() => navigate("/admin")}
        >
          Admin: view all families
        </button>
      )}

      {loading ? (
        <p className="text-secondary">Loading…</p>
      ) : (
        <div className="stack">
          {kids.map((kid) => (
            <button
              key={kid.id}
              type="button"
              className="card"
              style={{ textAlign: "left", cursor: "pointer", width: "100%" }}
              onClick={() => handleSelectKid(kid)}
            >
              <strong style={{ fontFamily: "var(--font-heading)" }}>{kid.username}</strong>
              <br />
              <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                {kid.sport ?? "No sport set"}
              </span>
            </button>
          ))}
          {kids.length === 0 && <p className="text-secondary">No kid profiles yet.</p>}
        </div>
      )}

      {!loading && kids.length < MAX_KIDS && <AddKidForm onAdded={refresh} />}
      {!loading && kids.length >= MAX_KIDS && (
        <p className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
          Maximum {MAX_KIDS} kid profiles reached.
        </p>
      )}
    </div>
  );
}
