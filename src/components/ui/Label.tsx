import type { ReactNode } from "react";
import styles from "./Label.module.css";

/** Small uppercase mono micro-label, used above panel/metric content. */
export default function Label({ children }: { children: ReactNode }) {
  return <div className={styles.label}>{children}</div>;
}
