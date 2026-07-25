import { useNavigate } from "react-router-dom";
import type { EntryContext } from "../../types";

export default function ContextStep({
  onSelect,
  exitTo = "/home",
}: {
  onSelect: (context: EntryContext) => void;
  exitTo?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => navigate(exitTo)}
          aria-label="Close"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "var(--text-lg)",
            cursor: "pointer",
            padding: "var(--space-2)",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <h1 className="text-center" style={{ fontSize: "var(--text-xl)" }}>
        Practice or game?
      </h1>

      <div className="stack">
        <button
          type="button"
          className="btn btn-primary btn-block"
          style={{ minHeight: 72, fontSize: "var(--text-lg)" }}
          onClick={() => onSelect("game")}
        >
          Game
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          style={{ minHeight: 72, fontSize: "var(--text-lg)" }}
          onClick={() => onSelect("practice")}
        >
          Practice
        </button>
      </div>

      <div style={{ flex: 2 }} />
    </div>
  );
}
