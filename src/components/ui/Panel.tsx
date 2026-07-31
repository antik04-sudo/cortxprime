import type { HTMLAttributes, ReactNode } from "react";
import Bracket from "./Bracket";
import styles from "./Panel.module.css";

/**
 * Clipped-top-right-corner container with a corner-bracket frame — the app's
 * replacement for rounded `.card` divs. Extra `style` overrides (e.g. padding)
 * are applied on top of the base panel styles, same as the reference files.
 */
export default function Panel({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.panel} ${className}`} {...rest}>
      <Bracket />
      {children}
    </div>
  );
}
