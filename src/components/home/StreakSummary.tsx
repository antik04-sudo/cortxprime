interface StreakSummaryProps {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
}

export default function StreakSummary({ currentStreak, longestStreak, totalEntries }: StreakSummaryProps) {
  const stats = [
    { label: "Current streak", value: currentStreak },
    { label: "Longest streak", value: longestStreak },
    { label: "Entries logged", value: totalEntries },
  ];

  return (
    <div className="card" style={{ display: "flex", justifyContent: "space-between" }}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center" style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-2xl)",
              fontWeight: 600,
              color: "var(--accent)",
            }}
          >
            {stat.value}
          </div>
          <div className="text-secondary" style={{ fontSize: "var(--text-xs)" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
