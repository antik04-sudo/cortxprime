import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { clearPendingAuthLinkType } from "../../lib/authLinkType";
import Button from "../ui/Button";

/**
 * Shared by two arrivals: finishing an invite (co-parent added via Supabase's
 * dashboard "Invite user") and resetting a forgotten password — both land
 * here with an active session but no password set yet. See RoleChooser.tsx
 * and ForgotPassword.tsx.
 */
export default function SetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = password.length >= 6 && password === confirmPassword;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    clearPendingAuthLinkType();
    navigate("/parent/dashboard", { replace: true });
  }

  return (
    <div className="screen">
      <h1>Set your password</h1>
      <p className="text-secondary">You'll use this to log in from now on.</p>

      <div className="field">
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div className="field">
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>

      {password.length > 0 && password.length < 6 && (
        <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>
          Password must be at least 6 characters.
        </p>
      )}
      {confirmPassword.length > 0 && password !== confirmPassword && (
        <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>Passwords don't match.</p>
      )}
      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

      <Button block disabled={!canSubmit || submitting} onClick={handleSubmit}>
        {submitting ? "Saving…" : "Set password"}
      </Button>
    </div>
  );
}
