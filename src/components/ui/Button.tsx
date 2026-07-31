import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  block?: boolean;
}

/**
 * Angular button — not present in the reference files (they're read-only
 * dashboards with no actions), designed to match their visual language: same
 * single-clipped-corner formula as Panel, mono uppercase label, cyan glow
 * only on press rather than at rest.
 */
export default function Button({ variant = "primary", block = false, className = "", ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? styles.primary : styles.secondary;
  return (
    <button
      className={`${styles.btn} ${variantClass} ${block ? styles.block : ""} ${className}`}
      {...props}
    />
  );
}
