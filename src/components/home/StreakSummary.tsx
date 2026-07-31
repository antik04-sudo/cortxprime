import Panel from "../ui/Panel";
import CoreGauge from "../ui/CoreGauge";
import MetricCard from "../ui/MetricCard";
import styles from "./StreakSummary.module.css";

interface StreakSummaryProps {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
}

export default function StreakSummary({ currentStreak, longestStreak, totalEntries }: StreakSummaryProps) {
  return (
    <div className={styles.wrap}>
      <Panel className={styles.gaugePanel}>
        <CoreGauge value={currentStreak} target={Math.max(longestStreak, 1)} label="DAY STREAK" />
      </Panel>
      <div className={styles.grid}>
        <MetricCard label="Longest streak" value={longestStreak} unit="days" tone="cyan" />
        <MetricCard label="Entries logged" value={totalEntries} unit="total" tone="cyan" />
      </div>
    </div>
  );
}
