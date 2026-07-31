import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { useKidSession } from "../../state/KidSessionContext";
import { updateMyKidPrefs } from "../../db/supabase/kidsRepo";
import { onboarding } from "../../content/copy";
import ProcessGoalPicker from "./ProcessGoalPicker";
import Button from "../ui/Button";
import styles from "./OnboardingFlow.module.css";

export default function OnboardingFlow() {
  const { kid, refreshKid } = useKidSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "welcome">("form");
  const [username, setUsername] = useState("");
  const [feelingWord, setFeelingWord] = useState("");
  const [customFeelingWord, setCustomFeelingWord] = useState("");
  const [processGoal, setProcessGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedFeelingWord = customFeelingWord || feelingWord;
  const trimmedUsername = username.trim();
  const canSubmit = trimmedUsername.length > 0 && resolvedFeelingWord.trim() && processGoal.trim();

  if (!kid) return null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateMyKidPrefs(kid!.id, {
        username: trimmedUsername,
        feelingWord: resolvedFeelingWord.trim(),
        processGoal: processGoal.trim(),
      });
      await refreshKid();
      setStep("welcome");
    } catch (e) {
      const code = (e as { code?: string })?.code;
      setError(code === "23505" ? "That username is taken — try another." : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "welcome") {
    return (
      <div className={`screen ${styles.welcome}`}>
        <div className={styles.wordmark}>
          <Zap size={26} className={styles.wordmarkIcon} />
          CORTX<span className={styles.wordmarkAccent}>PRIME</span>
        </div>
        <h1 className={styles.welcomeMessage}>{onboarding.welcomeMessage}</h1>
        <Button block onClick={() => navigate("/home")}>
          Let's go
        </Button>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1>{onboarding.screenIntro}</h1>

      <div className="field">
        <label htmlFor="kid-username">Choose your username</label>
        <input
          id="kid-username"
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="field">
        <label>One word for how you want to feel when you compete</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {onboarding.feelingWordExamples.map((word) => (
            <button
              key={word}
              type="button"
              className="chip"
              aria-pressed={feelingWord === word && !customFeelingWord}
              onClick={() => {
                setCustomFeelingWord("");
                setFeelingWord(word);
              }}
            >
              {word}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Or write your own"
          value={customFeelingWord}
          onChange={(e) => setCustomFeelingWord(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Your first process goal</label>
        <ProcessGoalPicker value={processGoal} onChange={setProcessGoal} />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

      <Button block disabled={!canSubmit || submitting} onClick={handleSubmit}>
        {submitting ? "Saving…" : "Set it up"}
      </Button>
    </div>
  );
}
