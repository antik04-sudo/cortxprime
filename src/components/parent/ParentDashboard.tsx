import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";
import { listMyKids } from "../../db/supabase/kidsRepo";
import type { KidProfile } from "../../types";
import AddKidForm from "./AddKidForm";

const MAX_KIDS = 2;

export default function ParentDashboard() {
  const { user, isAdmin, signOut } = useParentAuth();
  const navigate = useNavigate();

  const [kids, setKids] = useState<KidProfile[]>([]);
  const [loading, setLoading] = useState(true);

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
            <div key={kid.id} className="card">
              <strong style={{ fontFamily: "var(--font-heading)" }}>{kid.username}</strong>
              <br />
              <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                {kid.sport ?? "No sport set"}
              </span>
            </div>
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
