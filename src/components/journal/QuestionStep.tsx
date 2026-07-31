import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import Panel from "../ui/Panel";
import Button from "../ui/Button";
import styles from "./QuestionStep.module.css";

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
          className={styles.iconBtn}
        >
          {onBack ? <ArrowLeft size={20} /> : <X size={20} />}
        </button>
        <span className={styles.stepLabel}>{stepLabel}</span>
      </div>

      <h1 style={{ fontSize: "var(--text-xl)" }}>{question}</h1>
      {helperText && <p className="text-secondary">{helperText}</p>}

      <Panel className={styles.textareaPanel}>
        <textarea
          autoFocus
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.textarea}
        />
      </Panel>

      <div style={{ flex: 1 }} />

      <Button block disabled={!value.trim()} onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
