import styles from "./Bracket.module.css";

/** Corner-accent frame — the signature HUD element, always rendered inside a Panel. */
export default function Bracket() {
  return (
    <>
      <span className={`${styles.corner} ${styles.tl}`} />
      <span className={`${styles.corner} ${styles.tr}`} />
      <span className={`${styles.corner} ${styles.bl}`} />
      <span className={`${styles.corner} ${styles.br}`} />
    </>
  );
}
