import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveProfile } from "../../state/ActiveProfileContext";
import { useJournalEntries } from "../../hooks/useJournalEntries";
import { mistakeOfWeek } from "../../content/copy";
import { milestoneForCount } from "../../utils/streak";
import ContextStep from "./ContextStep";
import QuestionStep from "./QuestionStep";
import JournalCompletion from "./JournalCompletion";
import type { EntryContext, JournalEntry } from "../../types";

export default function MistakeOfWeekFlow() {
  const { activeProfile } = useActiveProfile();
  const { entries, logEntry } = useJournalEntries(activeProfile?.id);
  const navigate = useNavigate();

  const [context, setContext] = useState<EntryContext | null>(null);
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);

  if (!activeProfile) return null;

  async function handleFinish() {
    const entry: JournalEntry = {
      entryType: "mistake_of_week",
      context: context!,
      sport: activeProfile!.sport,
      answers: { q1: answer, q2: "", q3: "" },
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
        message={mistakeOfWeek.completionMessage}
        onContinue={() =>
          navigate("/home", { state: milestoneMessage ? { milestoneMessage } : undefined })
        }
      />
    );
  }

  return (
    <QuestionStep
      question={mistakeOfWeek.prompt}
      value={answer}
      onChange={setAnswer}
      stepLabel="Mistake of the week"
      nextLabel="Finish"
      onBack={() => setContext(null)}
      onNext={handleFinish}
    />
  );
}
