import { useState } from "react";
import { useParentAuth } from "../../state/ParentAuthContext";
import { SPORTS } from "../../constants/sports";

const PIN_PATTERN = /^\d{4}$/;

export default function AddKidForm({ onAdded }: { onAdded: () => void }) {
  const { session } = useParentAuth();

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [sport, setSport] = useState<string>(SPORTS[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = username.trim().length > 0 && PIN_PATTERN.test(pin);

  async function handleSubmit() {
    if (!session) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/add-kid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ username: username.trim(), pin, sport }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not add kid profile");
      return;
    }

    setUsername("");
    setPin("");
    setSport(SPORTS[0]);
    onAdded();
  }

  return (
    <div className="card stack">
      <h2 style={{ fontSize: "var(--text-lg)" }}>Add a kid profile</h2>

      <div className="field">
        <label htmlFor="kid-username">Username</label>
        <input id="kid-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="kid-pin">4-digit PIN</label>
        <input
          id="kid-pin"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <div className="field">
        <label htmlFor="kid-sport">Sport</label>
        <select
          id="kid-sport"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3) var(--space-4)",
            color: "var(--text-primary)",
            fontSize: "var(--text-md)",
            fontFamily: "inherit",
            minHeight: "var(--tap-min)",
          }}
        >
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

      <button
        type="button"
        className="btn btn-primary btn-block"
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Adding…" : "Add kid"}
      </button>
    </div>
  );
}
