import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import PanelButton from "../ui/PanelButton";
import type { EntryContext } from "../../types";
import styles from "./ContextStep.module.css";

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
        <button type="button" onClick={() => navigate(exitTo)} aria-label="Close" className={styles.close}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <h1 className="text-center" style={{ fontSize: "var(--text-xl)" }}>
        Practice or game?
      </h1>

      <div className="stack">
        <PanelButton className={`${styles.tile} ${styles.tilePrimary}`} onClick={() => onSelect("game")}>
          Game
        </PanelButton>
        <PanelButton className={styles.tile} onClick={() => onSelect("practice")}>
          Practice
        </PanelButton>
      </div>

      <div style={{ flex: 2 }} />
    </div>
  );
}
