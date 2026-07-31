import type { ButtonHTMLAttributes, ReactNode } from "react";
import Bracket from "./Bracket";
import panelStyles from "./Panel.module.css";
import styles from "./PanelButton.module.css";

/** Clickable variant of Panel — same visual treatment, real <button> semantics. */
export default function PanelButton({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${panelStyles.panel} ${styles.button} ${className}`} {...rest}>
      <Bracket />
      {children}
    </button>
  );
}
