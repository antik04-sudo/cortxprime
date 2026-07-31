import { Star } from "lucide-react";
import type { SelfTalkScript } from "../../types";
import { triggerLabels } from "../../content/selfTalkScripts";
import Panel from "../ui/Panel";
import Label from "../ui/Label";
import styles from "./ScriptCard.module.css";

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
    <Panel className={styles.card}>
      <div>
        <Label>{triggerLabels[script.trigger]}</Label>
        <p className={styles.quote}>"{script.text}"</p>
      </div>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label={isFavorited ? "Unfavorite" : "Favorite"}
        aria-pressed={isFavorited}
        className={styles.favorite}
      >
        <Star size={20} fill={isFavorited ? "currentColor" : "none"} />
      </button>
    </Panel>
  );
}
