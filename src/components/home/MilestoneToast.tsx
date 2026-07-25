import { useEffect, useState } from "react";

export default function MilestoneToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="card"
      role="status"
      style={{
        background: "var(--accent)",
        color: "var(--text-primary)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "var(--space-3)",
      }}
    >
      <p style={{ fontWeight: 600 }}>{message}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: "var(--text-primary)",
          fontSize: "var(--text-lg)",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
}
