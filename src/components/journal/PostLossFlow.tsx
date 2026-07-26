import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKidSession } from "../../state/KidSessionContext";
import { useJournalEntries } from "../../hooks/useJournalEntries";
import { postLoss } from "../../content/copy";
import { milestoneForCount } from "../../utils/streak";
import ContextStep from "./ContextStep";
import BreathingExercise from "./BreathingExercise";
import QuestionStep from "./QuestionStep";
import JournalCompletion from "./JournalCompletion";
import type { EntryContext, JournalEntry } from "../../types";

type Stage = "context" | "breathing" | "reflect" | "done";

export default function PostLossFlow() {
  const { kid } = useKidSession();
  const { entries, logEntry } = useJournalEntries(kid?.id);
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>("context");
  const [context, setContext] = useState<EntryContext | null>(null);
  const [reflectStep, setReflectStep] = useState(0);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);

  if (!kid) return null;

  async function handleFinish(finalAnswers: typeof answers) {
    const entry: JournalEntry = {
      entryType: "post_loss",
      context: context!,
      sport: kid!.sport ?? "",
      answers: finalAnswers,
      feltWord: finalAnswers.q1,
      processGoal: kid!.processGoal ?? "",
      timestamp: new Date().toISOString(),
    };
    setMilestoneMessage(milestoneForCount(entries.length + 1));
    await logEntry(entry);
    setStage("done");
  }

  if (stage === "context") {
    return (
      <ContextStep
        onSelect={(selected) => {
          setContext(selected);
          setStage("breathing");
        }}
      />
    );
  }

  if (stage === "breathing") {
    return <BreathingExercise onComplete={() => setStage("reflect")} />;
  }

  if (stage === "done") {
    return (
      <JournalCompletion
        message={postLoss.completionMessage}
        onContinue={() =>
          navigate("/home", { state: milestoneMessage ? { milestoneMessage } : undefined })
        }
      />
    );
  }

  const questionKeys = ["q1", "q2", "q3"] as const;
  const key = questionKeys[reflectStep];

  return (
    <QuestionStep
      question={postLoss.questions[reflectStep]}
      value={answers[key]}
      onChange={(value) => setAnswers((prev) => ({ ...prev, [key]: value }))}
      stepLabel={`Question ${reflectStep + 1} of 3`}
      onBack={reflectStep > 0 ? () => setReflectStep((s) => s - 1) : undefined}
      nextLabel={reflectStep === 2 ? "Finish" : "Next"}
      onNext={() => {
        if (reflectStep < 2) {
          setReflectStep((s) => s + 1);
        } else {
          handleFinish(answers);
        }
      }}
    />
  );
}
