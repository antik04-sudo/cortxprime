import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";
import { listMyKids, updateMyKidPrefs } from "../../db/supabase/kidsRepo";
import { listEntriesForProfile } from "../../db/supabase/entriesRepo";
import type { KidProfile, SupabaseJournalEntry } from "../../types";
import AddKidForm from "./AddKidForm";
import PanelButton from "../ui/PanelButton";
import EntryList from "../ui/EntryList";
import Button from "../ui/Button";

const MAX_KIDS = 2;

export default function ParentDashboard() {
  const { user, isAdmin, signOut } = useParentAuth();
  const navigate = useNavigate();

  const [kids, setKids] = useState<KidProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKid, setSelectedKid] = useState<KidProfile | null>(null);
  const [entries, setEntries] = useState<SupabaseJournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);

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
    setEditingUsername(false);
    setUsernameError(null);
    setEntriesLoading(true);
    const data = await listEntriesForProfile(kid.id);
    setEntries(data);
    setEntriesLoading(false);
  }

  function startEditingUsername() {
    if (!selectedKid) return;
    setUsernameDraft(selectedKid.username);
    setUsernameError(null);
    setEditingUsername(true);
  }

  async function handleSaveUsername() {
    if (!selectedKid) return;
    const trimmed = usernameDraft.trim();
    if (!trimmed) return;

    setSavingUsername(true);
    setUsernameError(null);
    try {
      await updateMyKidPrefs(selectedKid.id, { username: trimmed });
      setSelectedKid({ ...selectedKid, username: trimmed });
      setEditingUsername(false);
      await refresh();
    } catch (e) {
      const code = (e as { code?: string })?.code;
      setUsernameError(code === "23505" ? "That username is taken — try another." : "Something went wrong. Try again.");
    } finally {
      setSavingUsername(false);
    }
  }

  if (selectedKid) {
    return (
      <div className="screen">
        <button type="button" onClick={() => setSelectedKid(null)} className="text-btn" style={{ alignSelf: "flex-start" }}>
          ← Back to your family
        </button>

        {editingUsername ? (
          <div className="field">
            <label htmlFor="edit-username">Username</label>
            <input
              id="edit-username"
              type="text"
              value={usernameDraft}
              onChange={(e) => setUsernameDraft(e.target.value)}
              autoFocus
            />
            {usernameError && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{usernameError}</p>}
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Button
                disabled={!usernameDraft.trim() || savingUsername}
                onClick={handleSaveUsername}
                style={{ flex: 1 }}
              >
                {savingUsername ? "Saving…" : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => setEditingUsername(false)} style={{ flex: 1 }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "var(--text-xl)" }}>{selectedKid.username}'s entries</h1>
            <button type="button" onClick={startEditingUsername} className="text-btn">
              Edit username
            </button>
          </div>
        )}

        {entriesLoading ? <p className="text-secondary">Loading…</p> : <EntryList entries={entries} />}
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "var(--text-xl)" }}>Your family</h1>
        <button type="button" onClick={handleSignOut} className="text-btn">
          Sign out
        </button>
      </div>

      <p className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
        {user?.email}
      </p>

      {isAdmin && (
        <Button variant="secondary" block onClick={() => navigate("/admin")}>
          Admin: view all families
        </Button>
      )}

      {loading ? (
        <p className="text-secondary">Loading…</p>
      ) : (
        <div className="stack">
          {kids.map((kid) => (
            <PanelButton key={kid.id} onClick={() => handleSelectKid(kid)}>
              <strong style={{ fontFamily: "var(--font-heading)" }}>{kid.username}</strong>
              <br />
              <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                {kid.sport ?? "No sport set"}
              </span>
            </PanelButton>
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
