import AppShell from "../layout/AppShell";
import { useActiveProfile } from "../../state/ActiveProfileContext";
import { useJournalEntries } from "../../hooks/useJournalEntries";
import { useStreak } from "../../hooks/useStreak";
import StreakSummary from "../home/StreakSummary";
import MilestoneHistory from "./MilestoneHistory";

export default function ProgressScreen() {
  const { activeProfile } = useActiveProfile();
  const { entries } = useJournalEntries(activeProfile?.id);
  const streak = useStreak(entries);

  return (
    <AppShell>
      <div className="stack">
        <h1 style={{ fontSize: "var(--text-xl)" }}>Your progress</h1>
        <StreakSummary
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          totalEntries={streak.totalEntries}
        />
        <MilestoneHistory totalEntries={streak.totalEntries} />
      </div>
    </AppShell>
  );
}
