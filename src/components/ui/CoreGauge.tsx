import { useEffect, useState } from "react";
import styles from "./CoreGauge.module.css";

const SIZE = 200;
const R = 78;
const C = 2 * Math.PI * R;
const CENTER = SIZE / 2;

/**
 * Animated progress ring — the app's one glow showpiece. Repurposed from the
 * reference's placeholder "core load %" to show real streak progress toward
 * the next milestone.
 */
export default function CoreGauge({
  value,
  target,
  label = "DAY STREAK",
}: {
  value: number;
  target: number;
  label?: string;
}) {
  const [sweep, setSweep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSweep((s) => (s + 1) % 100), 60);
    return () => clearInterval(id);
  }, []);

  const pct = target > 0 ? Math.min(value / target, 1) : 1;

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg}>
        <circle cx={CENTER} cy={CENTER} r={R} fill="none" style={{ stroke: "var(--border)" }} strokeWidth={2} />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          style={{ stroke: "var(--accent)" }}
          strokeWidth={2}
          strokeDasharray={`${C * pct} ${C}`}
          strokeLinecap="butt"
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          className={styles.progress}
        />
      </svg>
      <div className={styles.sweepLine} style={{ top: `${sweep}%` }} />
      <div className={styles.readout}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
