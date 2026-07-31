import { useEffect, useState } from "react";
import Panel from "../ui/Panel";
import styles from "./MilestoneToast.module.css";

export default function MilestoneToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Panel className={styles.toast} role="status">
      <p className={styles.message}>{message}</p>
      <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss" className={styles.dismiss}>
        &times;
      </button>
    </Panel>
  );
}
