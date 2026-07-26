import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";

export default function ParentLogin() {
  const { signIn } = useParentAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    navigate("/parent/dashboard");
  }

  return (
    <div className="screen">
      <h1>Log in</h1>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

      <button
        type="button"
        className="btn btn-primary btn-block"
        disabled={!email.trim() || !password || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Logging in…" : "Log in"}
      </button>

      <p className="text-secondary text-center" style={{ fontSize: "var(--text-sm)" }}>
        No account yet? <Link to="/parent/signup">Sign up</Link>
      </p>
    </div>
  );
}
