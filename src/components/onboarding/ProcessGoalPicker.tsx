import { useState } from "react";
import { processGoalLibrary, processGoalRule } from "../../content/processGoals";

interface ProcessGoalPickerProps {
  value: string;
  onChange: (goal: string) => void;
}

export default function ProcessGoalPicker({ value, onChange }: ProcessGoalPickerProps) {
  const [customText, setCustomText] = useState("");
  const isCustomSelected = customText.length > 0 && value === customText;

  function handleCustomChange(text: string) {
    setCustomText(text);
    onChange(text);
  }

  return (
    <div className="stack">
      <p className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
        {processGoalRule}
      </p>
      {processGoalLibrary.map((group) => (
        <div key={group.label} className="stack" style={{ gap: "var(--space-2)" }}>
          <span
            className="text-secondary"
            style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.04em" }}
          >
            {group.label}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {group.goals.map((goal) => (
              <button
                key={goal}
                type="button"
                className="chip"
                aria-pressed={value === goal}
                onClick={() => {
                  setCustomText("");
                  onChange(goal);
                }}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="field">
        <label htmlFor="custom-goal">Write your own</label>
        <input
          id="custom-goal"
          type="text"
          value={customText}
          placeholder="Your process goal"
          onChange={(e) => handleCustomChange(e.target.value)}
        />
      </div>
      {value && (
        <p style={{ fontSize: "var(--text-sm)" }}>
          Selected: <strong>{isCustomSelected ? customText : value}</strong>
        </p>
      )}
    </div>
  );
}
