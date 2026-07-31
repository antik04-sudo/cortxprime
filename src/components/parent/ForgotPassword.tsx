import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Button from "../ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/#/parent/set-password`,
    });
    setSubmitting(false);
    // Same message regardless of whether the account exists, so we don't leak
    // which emails are registered.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-5)" }}>
        <h1 style={{ fontSize: "var(--text-xl)" }}>Check your email</h1>
        <p className="text-secondary">
          If an account exists for {email}, we sent a link to reset your password.
        </p>
        <Link to="/parent/login" className="text-btn" style={{ alignSelf: "center" }}>
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1>Reset your password</h1>
      <p className="text-secondary">Enter your email and we'll send you a reset link.</p>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>

      <Button block disabled={!email.trim() || submitting} onClick={handleSubmit}>
        {submitting ? "Sending…" : "Send reset link"}
      </Button>

      <p className="text-secondary text-center" style={{ fontSize: "var(--text-sm)" }}>
        <Link to="/parent/login">Back to login</Link>
      </p>
    </div>
  );
}
