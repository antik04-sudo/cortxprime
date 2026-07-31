import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";
import Button from "../ui/Button";

export default function ParentSignup() {
  const { signUp } = useParentAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const { error } = await signUp(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-5)" }}>
        <h1 style={{ fontSize: "var(--text-xl)" }}>Check your email</h1>
        <p className="text-secondary">
          We sent a confirmation link to {email}. Confirm it, then come back and log in.
        </p>
        <Button variant="secondary" block onClick={() => navigate("/parent/login")}>
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1>Create your parent account</h1>

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
          autoComplete="new-password"
        />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

      <Button block disabled={!email.trim() || password.length < 6 || submitting} onClick={handleSubmit}>
        {submitting ? "Creating account…" : "Sign up"}
      </Button>

      <p className="text-secondary text-center" style={{ fontSize: "var(--text-sm)" }}>
        Already have an account? <Link to="/parent/login">Log in</Link>
      </p>
    </div>
  );
}
