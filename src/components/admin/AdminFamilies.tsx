import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";
import { listEntriesForProfile } from "../../db/supabase/entriesRepo";
import type { SupabaseJournalEntry } from "../../types";

interface Kid {
  id: string;
  username: string;
  sport: string | null;
}

interface Family {
  parentId: string;
  parentEmail: string | null;
  kids: Kid[];
}

export default function AdminFamilies() {
  const { session, isAdmin, loading: authLoading } = useParentAuth();
  const navigate = useNavigate();

  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [entries, setEntries] = useState<SupabaseJournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate("/parent/dashboard");
      return;
    }
    if (!session) return;

    fetch("/api/admin-families", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Could not load families");
        setFamilies(body.families);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [authLoading, isAdmin, session, navigate]);

  async function handleSelectKid(kid: Kid) {
    setSelectedKid(kid);
    setEntriesLoading(true);
    const data = await listEntriesForProfile(kid.id);
    setEntries(data);
    setEntriesLoading(false);
  }

  if (authLoading || loading) {
    return (
      <div className="screen">
        <p className="text-secondary">Loading…</p>
      </div>
    );
  }

  if (selectedKid) {
    return (
      <div className="screen">
        <button
          type="button"
          onClick={() => setSelectedKid(null)}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "var(--text-sm)", cursor: "pointer", alignSelf: "flex-start" }}
        >
          ← Back to families
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
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)" }} className="text-secondary">
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
      <h1 style={{ fontSize: "var(--text-xl)" }}>All families</h1>

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

      <div className="stack">
        {families.map((family) => (
          <div key={family.parentId} className="card">
            <button
              type="button"
              onClick={() =>
                setExpandedParentId(expandedParentId === family.parentId ? null : family.parentId)
              }
              style={{
                background: "none",
                border: "none",
                color: "var(--text-primary)",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ fontFamily: "var(--font-heading)" }}>
                {family.parentEmail ?? "Unknown parent"}
              </strong>
              <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                {family.kids.length} kid{family.kids.length === 1 ? "" : "s"}
              </span>
            </button>

            {expandedParentId === family.parentId && (
              <div className="stack" style={{ marginTop: "var(--space-4)" }}>
                {family.kids.map((kid) => (
                  <button
                    key={kid.id}
                    type="button"
                    onClick={() => handleSelectKid(kid)}
                    style={{
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-3) var(--space-4)",
                      color: "var(--text-primary)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {kid.username}
                    {kid.sport && (
                      <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                        {" "}
                        · {kid.sport}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {families.length === 0 && <p className="text-secondary">No families yet.</p>}
      </div>
    </div>
  );
}
