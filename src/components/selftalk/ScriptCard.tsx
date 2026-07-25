import type { SelfTalkScript } from "../../types";
import { triggerLabels } from "../../content/selfTalkScripts";

export default function ScriptCard({
  script,
  isFavorited,
  onToggleFavorite,
}: {
  script: SelfTalkScript;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
      <div>
        <span className="text-secondary" style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {triggerLabels[script.trigger]}
        </span>
        <p style={{ fontSize: "var(--text-lg)", fontFamily: "var(--font-heading)", fontWeight: 500, marginTop: "var(--space-1)" }}>
          "{script.text}"
        </p>
      </div>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label={isFavorited ? "Unfavorite" : "Favorite"}
        aria-pressed={isFavorited}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "var(--text-xl)",
          color: isFavorited ? "var(--accent)" : "var(--text-tertiary)",
          minWidth: "var(--tap-min)",
          minHeight: "var(--tap-min)",
        }}
      >
        {isFavorited ? "★" : "☆"}
      </button>
    </div>
  );
}
