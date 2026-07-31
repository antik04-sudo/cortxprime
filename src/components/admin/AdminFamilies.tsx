import { useEffect, useState } from "react";
import { useParentAuth } from "../../state/ParentAuthContext";
import { listEntriesForProfile } from "../../db/supabase/entriesRepo";
import type { SupabaseJournalEntry } from "../../types";
import Panel from "../ui/Panel";
import PanelButton from "../ui/PanelButton";
import EntryList from "../ui/EntryList";

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
  const { session } = useParentAuth();

  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [entries, setEntries] = useState<SupabaseJournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  useEffect(() => {
    // RequireAdmin (App.tsx) guarantees session exists before this renders
    fetch("/api/admin-families", {
      headers: { Authorization: `Bearer ${session!.access_token}` },
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Could not load families");
        setFamilies(body.families);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session]);

  async function handleSelectKid(kid: Kid) {
    setSelectedKid(kid);
    setEntriesLoading(true);
    const data = await listEntriesForProfile(kid.id);
    setEntries(data);
    setEntriesLoading(false);
  }

  if (loading) {
    return (
      <div className="screen">
        <p className="text-secondary">Loading…</p>
      </div>
    );
  }

  if (selectedKid) {
    return (
      <div className="screen">
        <button type="button" onClick={() => setSelectedKid(null)} className="text-btn" style={{ alignSelf: "flex-start" }}>
          ← Back to families
        </button>
        <h1 style={{ fontSize: "var(--text-xl)" }}>{selectedKid.username}'s entries</h1>

        {entriesLoading ? <p className="text-secondary">Loading…</p> : <EntryList entries={entries} />}
      </div>
    );
  }

  return (
    <div className="screen">
      <h1 style={{ fontSize: "var(--text-xl)" }}>All families</h1>

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

      <div className="stack">
        {families.map((family) => (
          <Panel key={family.parentId}>
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
                  <PanelButton key={kid.id} onClick={() => handleSelectKid(kid)}>
                    {kid.username}
                    {kid.sport && (
                      <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                        {" "}
                        · {kid.sport}
                      </span>
                    )}
                  </PanelButton>
                ))}
              </div>
            )}
          </Panel>
        ))}
        {families.length === 0 && <p className="text-secondary">No families yet.</p>}
      </div>
    </div>
  );
}
