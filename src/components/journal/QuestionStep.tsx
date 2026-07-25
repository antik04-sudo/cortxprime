import { useNavigate } from "react-router-dom";

interface QuestionStepProps {
  question: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  stepLabel: string;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  exitTo?: string;
}

export default function QuestionStep({
  question,
  helperText,
  value,
  onChange,
  stepLabel,
  onNext,
  onBack,
  nextLabel = "Next",
  exitTo = "/home",
}: QuestionStepProps) {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(exitTo))}
          aria-label={onBack ? "Back" : "Close"}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "var(--text-lg)", cursor: "pointer", padding: "var(--space-2)" }}
        >
          {onBack ? "←" : "×"}
        </button>
        <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
          {stepLabel}
        </span>
      </div>

      <h1 style={{ fontSize: "var(--text-xl)" }}>{question}</h1>
      {helperText && <p className="text-secondary">{helperText}</p>}

      <textarea
        autoFocus
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="branded-textarea"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          color: "var(--text-primary)",
          fontSize: "var(--text-md)",
          fontFamily: "inherit",
        }}
      />

      <div style={{ flex: 1 }} />

      <button type="button" className="btn btn-primary btn-block" disabled={!value.trim()} onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  );
}
