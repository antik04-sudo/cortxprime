import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKidSession } from "../../state/KidSessionContext";
import { hasAnyLocalData, isMigrationHandled } from "../../db/migrationRepo";
import Button from "../ui/Button";
import PinKeypad from "./PinKeypad";
import styles from "./KidLoginFlow.module.css";

type Step = "username" | "pin";

export default function KidLoginFlow() {
  const { loginWithTokenHash } = useKidSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const trimmedUsername = username.trim();

  function handlePinChange(value: string) {
    setPin(value);
    if (value.length === 4 && !submitting) {
      handleSubmitPin(value);
    }
  }

  async function handleSubmitPin(pinValue: string) {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/kid-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUsername, pin: pinValue }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Wrong PIN, try again");
        setPin("");
        setSubmitting(false);
        return;
      }

      const { error: sessionError } = await loginWithTokenHash(body.tokenHash);
      if (sessionError) {
        setError("Wrong PIN, try again");
        setPin("");
        setSubmitting(false);
        return;
      }

      const kidId = body.kid.id as string;
      if (!isMigrationHandled(kidId) && (await hasAnyLocalData())) {
        navigate("/migrate-local-data");
        return;
      }

      // RequireKidReady (on /home) bounces to /onboarding itself if setup's incomplete
      navigate("/home");
    } catch {
      setError("Something went wrong. Try again.");
      setPin("");
      setSubmitting(false);
    }
  }

  if (step === "username") {
    return (
      <div className="screen">
        <h1>Log in</h1>

        <div className="field">
          <label htmlFor="kid-username">Username</label>
          <input
            id="kid-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            onKeyDown={(e) => e.key === "Enter" && trimmedUsername && setStep("pin")}
          />
        </div>

        <Button block disabled={!trimmedUsername} onClick={() => setStep("pin")}>
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-5)" }}>
      <button
        type="button"
        onClick={() => {
          setStep("username");
          setPin("");
          setError(null);
        }}
        className={styles.back}
      >
        ← Not {trimmedUsername}?
      </button>

      <h1 style={{ fontSize: "var(--text-xl)" }}>Enter your PIN</h1>

      <PinKeypad value={pin} onChange={handlePinChange} disabled={submitting} />

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}
    </div>
  );
}
