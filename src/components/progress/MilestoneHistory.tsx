import { milestoneMessages } from "../../content/copy";
import Panel from "../ui/Panel";
import styles from "./MilestoneHistory.module.css";

const MILESTONE_COUNTS = [3, 7, 21] as const;

export default function MilestoneHistory({ totalEntries }: { totalEntries: number }) {
  return (
    <div className="stack">
      <h2 className={styles.title}>Milestones</h2>
      {MILESTONE_COUNTS.map((count) => {
        const reached = totalEntries >= count;
        return (
          <Panel key={count} className={reached ? `${styles.row} ${styles.reached}` : styles.row}>
            <div className={reached ? `${styles.badge} ${styles.badgeReached}` : styles.badge}>{count}</div>
            <p className={styles.message}>{milestoneMessages[count]}</p>
          </Panel>
        );
      })}
    </div>
  );
}
