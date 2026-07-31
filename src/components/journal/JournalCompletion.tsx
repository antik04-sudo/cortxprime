import Panel from "../ui/Panel";
import Button from "../ui/Button";
import styles from "./JournalCompletion.module.css";

export default function JournalCompletion({
  message,
  onContinue,
}: {
  message: string;
  onContinue: () => void;
}) {
  return (
    <div className="screen" style={{ justifyContent: "center", gap: "var(--space-6)" }}>
      <Panel className={styles.panel}>
        <p className={styles.message}>{message}</p>
      </Panel>
      <Button block onClick={onContinue}>
        Done
      </Button>
    </div>
  );
}
