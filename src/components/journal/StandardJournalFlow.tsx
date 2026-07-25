import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveProfile } from "../../state/ActiveProfileContext";
import { useJournalEntries } from "../../hooks/useJournalEntries";
import { standardJournal } from "../../content/copy";
import { milestoneForCount } from "../../utils/streak";
import ContextStep from "./ContextStep";
import QuestionStep from "./QuestionStep";
import JournalCompletion from "./JournalCompletion";
import type { EntryContext, JournalEntry } from "../../types";

export default function StandardJournalFlow() {
  const { activeProfile } = useActiveProfile();
  const { entries, logEntry } = useJournalEntries(activeProfile?.id);
  const navigate = useNavigate();

  const [context, setContext] = useState<EntryContext | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [done, setDone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);

  if (!activeProfile) return null;

  async function handleFinish(finalAnswers: typeof answers) {
    const entry: JournalEntry = {
      entryType: "standard",
      context: context!,
      sport: activeProfile!.sport,
      answers: finalAnswers,
      feltWord: null,
      processGoal: activeProfile!.processGoal,
      timestamp: new Date().toISOString(),
    };
    setMilestoneMessage(milestoneForCount(entries.length + 1));
    await logEntry(entry);
    setDone(true);
  }

  if (!context) {
    return <ContextStep onSelect={setContext} />;
  }

  if (done) {
    return (
      <JournalCompletion
        message={standardJournal.completionMessage}
        onContinue={() =>
          navigate("/home", { state: milestoneMessage ? { milestoneMessage } : undefined })
        }
      />
    );
  }

  const questionKeys = ["q1", "q2", "q3"] as const;
  const key = questionKeys[step];

  return (
    <QuestionStep
      question={standardJournal.questions[step]}
      helperText={standardJournal.helperText}
      value={answers[key]}
      onChange={(value) => setAnswers((prev) => ({ ...prev, [key]: value }))}
      stepLabel={`Question ${step + 1} of 3`}
      onBack={step > 0 ? () => setStep((s) => s - 1) : () => setContext(null)}
      nextLabel={step === 2 ? "Finish" : "Next"}
      onNext={() => {
        if (step < 2) {
          setStep((s) => s + 1);
        } else {
          handleFinish(answers);
        }
      }}
    />
  );
}
