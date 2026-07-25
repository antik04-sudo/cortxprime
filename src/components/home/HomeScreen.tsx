import { useLocation, Navigate } from "react-router-dom";
import AppShell from "../layout/AppShell";
import { useActiveProfile } from "../../state/ActiveProfileContext";
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
  const { activeProfile, loading: profileLoading } = useActiveProfile();
  const { entries } = useJournalEntries(activeProfile?.id);
  const streak = useStreak(entries);
  const location = useLocation();
  const state = location.state as HomeLocationState | null;

  if (!profileLoading && !activeProfile) return <Navigate to="/" replace />;

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
