import { promptOfTheDay } from "../../utils/promptRotation";

export default function PromptOfTheDayCard() {
  return (
    <div className="card" style={{ background: "var(--accent-tint)", border: "1px solid var(--accent)" }}>
      <span
        className="text-secondary"
        style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em" }}
      >
        Today's mindset
      </span>
      <p style={{ fontSize: "var(--text-lg)", fontFamily: "var(--font-heading)", fontWeight: 500, marginTop: "var(--space-2)" }}>
        {promptOfTheDay()}
      </p>
    </div>
  );
}
