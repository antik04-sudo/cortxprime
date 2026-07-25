import { milestoneMessages } from "../../content/copy";

const MILESTONE_COUNTS = [3, 7, 21] as const;

export default function MilestoneHistory({ totalEntries }: { totalEntries: number }) {
  return (
    <div className="stack">
      <h2 style={{ fontSize: "var(--text-lg)" }}>Milestones</h2>
      {MILESTONE_COUNTS.map((count) => {
        const reached = totalEntries >= count;
        return (
          <div
            key={count}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              opacity: reached ? 1 : 0.5,
              border: reached ? "1px solid var(--accent)" : undefined,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                background: reached ? "var(--accent)" : "var(--surface-raised)",
                color: reached ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {count}
            </div>
            <p style={{ fontSize: "var(--text-sm)" }}>{milestoneMessages[count]}</p>
          </div>
        );
      })}
    </div>
  );
}
