import { useLocation } from "react-router-dom";
import AppShell from "../layout/AppShell";
import { useKidSession } from "../../state/KidSessionContext";
import { useJournalEntries } from "../../hooks/useJournalEntries";
import { useStreak } from "../../hooks/useStreak";
import PromptOfTheDayCard from "./PromptOfTheDayCard";
import StreakSummary from "./StreakSummary";
import QuickActionButtons from "./QuickActionButtons";
import MilestoneToast from "./MilestoneToast";

interface HomeLocationState {
  milestoneMessage?: string;
}

export default function HomeScreen() {
  const { kid } = useKidSession();
  const { entries } = useJournalEntries(kid?.id);
  const streak = useStreak(entries);
  const location = useLocation();
  const state = location.state as HomeLocationState | null;

  return (
    <AppShell>
      <div className="stack">
        {state?.milestoneMessage && <MilestoneToast message={state.milestoneMessage} />}
        <PromptOfTheDayCard />
        <StreakSummary
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          totalEntries={streak.totalEntries}
        />
        <QuickActionButtons />
      </div>
    </AppShell>
  );
}
