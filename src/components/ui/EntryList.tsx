import Panel from "./Panel";
import type { SupabaseJournalEntry } from "../../types";
import styles from "./EntryList.module.css";

/** Shared entry-detail list used by both the parent dashboard and admin views. */
export default function EntryList({ entries }: { entries: SupabaseJournalEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-secondary">No entries yet.</p>;
  }

  return (
    <div className="stack">
      {entries.map((entry) => (
        <Panel key={entry.id}>
          <div className={styles.meta}>
            <span>{entry.entryType.replace(/_/g, " ")}</span>
            <span>{entry.context ?? "—"}</span>
          </div>
          <p className={styles.timestamp}>{new Date(entry.timestamp).toLocaleString()}</p>
          {entry.feltWord && <p className={styles.felt}>Felt: {entry.feltWord}</p>}
          <div className="stack" style={{ marginTop: "var(--space-3)" }}>
            {[entry.answers.q1, entry.answers.q2, entry.answers.q3]
              .filter(Boolean)
              .map((answer, i) => (
                <p key={i} className={styles.answer}>
                  {answer}
                </p>
              ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}
