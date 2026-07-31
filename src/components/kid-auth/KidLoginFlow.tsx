import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listKidPublicProfiles } from "../../db/supabase/kidsRepo";
import { useKidSession } from "../../state/KidSessionContext";
import { hasAnyLocalData, isMigrationHandled } from "../../db/migrationRepo";
import type { KidPublicProfile } from "../../types";
import PanelButton from "../ui/PanelButton";
import PinKeypad from "./PinKeypad";
import styles from "./KidLoginFlow.module.css";

type Step = "select" | "pin";

export default function KidLoginFlow() {
  const { loginWithTokenHash } = useKidSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("select");
  const [profiles, setProfiles] = useState<KidPublicProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [selected, setSelected] = useState<KidPublicProfile | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listKidPublicProfiles()
      .then(setProfiles)
      .finally(() => setLoadingProfiles(false));
  }, []);

  useEffect(() => {
    if (pin.length === 4 && !submitting) {
      handleSubmitPin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  async function handleSubmitPin() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/kid-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: selected.username, pin }),
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

  if (step === "select") {
    return (
      <div className="screen">
        <h1>Who's this?</h1>
        {loadingProfiles && <p className="text-secondary">Loading…</p>}
        <div className="stack">
          {profiles.map((profile) => (
            <PanelButton
              key={profile.id}
              onClick={() => {
                setSelected(profile);
                setError(null);
                setPin("");
                setStep("pin");
              }}
            >
              <span className={styles.username}>{profile.username}</span>
              {profile.sport && (
                <>
                  <br />
                  <span className={styles.sport}>{profile.sport}</span>
                </>
              )}
            </PanelButton>
          ))}
          {!loadingProfiles && profiles.length === 0 && (
            <p className="text-secondary">No profiles yet — ask a parent to set one up.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-5)" }}>
      <button type="button" onClick={() => setStep("select")} className={styles.back}>
        ← Not {selected?.username}?
      </button>

      <h1 style={{ fontSize: "var(--text-xl)" }}>Enter your PIN</h1>

      <PinKeypad value={pin} onChange={setPin} disabled={submitting} />

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}
    </div>
  );
}
