import Panel from "./Panel";
import Label from "./Label";
import styles from "./MetricCard.module.css";

type Tone = "cyan" | "amber" | "danger";

const toneClass: Record<Tone, string> = {
  cyan: styles.cyan,
  amber: styles.amber,
  danger: styles.danger,
};

export default function MetricCard({
  label,
  value,
  unit,
  trend,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  tone?: Tone;
}) {
  return (
    <Panel className={styles.card}>
      <Label>{label}</Label>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={`${styles.unit} ${toneClass[tone]}`}>{unit}</span>}
      </div>
      {trend && <div className={`${styles.trend} ${toneClass[tone]}`}>{trend}</div>}
    </Panel>
  );
}
