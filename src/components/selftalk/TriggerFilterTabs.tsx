import type { TriggerTag } from "../../types";
import { triggerLabels } from "../../content/selfTalkScripts";
import styles from "./TriggerFilterTabs.module.css";

export type TriggerFilter = TriggerTag | "all";

const options: TriggerFilter[] = ["all", "after_mistake", "nerves", "frustration", "low_confidence"];

export default function TriggerFilterTabs({
  value,
  onChange,
}: {
  value: TriggerFilter;
  onChange: (value: TriggerFilter) => void;
}) {
  return (
    <div className={styles.row}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={styles.tab}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option === "all" ? "All" : triggerLabels[option]}
        </button>
      ))}
    </div>
  );
}
