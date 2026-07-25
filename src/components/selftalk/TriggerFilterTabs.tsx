import type { TriggerTag } from "../../types";
import { triggerLabels } from "../../content/selfTalkScripts";

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
    <div style={{ display: "flex", gap: "var(--space-2)", overflowX: "auto", paddingBottom: "var(--space-1)" }}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="chip"
          style={{ flexShrink: 0 }}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option === "all" ? "All" : triggerLabels[option]}
        </button>
      ))}
    </div>
  );
}
