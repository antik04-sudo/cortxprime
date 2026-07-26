import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKidSession } from "../../state/KidSessionContext";
import { updateMyKidPrefs } from "../../db/supabase/kidsRepo";
import { onboarding } from "../../content/copy";
import ProcessGoalPicker from "./ProcessGoalPicker";

export default function OnboardingFlow() {
  const { kid, refreshKid } = useKidSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "welcome">("form");
  const [feelingWord, setFeelingWord] = useState("");
  const [customFeelingWord, setCustomFeelingWord] = useState("");
  const [processGoal, setProcessGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resolvedFeelingWord = customFeelingWord || feelingWord;
  const canSubmit = resolvedFeelingWord.trim() && processGoal.trim();

  if (!kid) return null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    await updateMyKidPrefs(kid!.id, {
      feelingWord: resolvedFeelingWord.trim(),
      processGoal: processGoal.trim(),
    });
    await refreshKid();
    setSubmitting(false);
    setStep("welcome");
  }

  if (step === "welcome") {
    return (
      <div
        className="screen"
        style={{
          justifyContent: "center",
          textAlign: "center",
          gap: "var(--space-7)",
          background: "#f6f8fa",
          color: "var(--bg)",
          minHeight: "100dvh",
        }}
      >
        <img
          src="/logo-lockup-400.png"
          alt="CortXPrime"
          style={{ width: "min(280px, 70%)", margin: "var(--space-6) auto 0" }}
        />
        <h1 style={{ fontSize: "var(--text-2xl)", color: "var(--bg)" }}>{onboarding.welcomeMessage}</h1>
        <button type="button" className="btn btn-primary btn-block" onClick={() => navigate("/home")}>
          Let's go
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1>{onboarding.screenIntro}</h1>

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

      <button
        type="button"
        className="btn btn-primary btn-block"
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Saving…" : "Set it up"}
      </button>
    </div>
  );
}
