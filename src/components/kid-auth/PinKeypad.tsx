import styles from "./PinKeypad.module.css";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export default function PinKeypad({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  function handleKey(key: string) {
    if (disabled) return;
    if (key === "back") {
      onChange(value.slice(0, -1));
    } else if (key && value.length < PIN_LENGTH) {
      onChange(value + key);
    }
  }

  return (
    <div>
      <div className={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div key={i} className={i < value.length ? `${styles.dot} ${styles.filled}` : styles.dot} />
        ))}
      </div>

      <div className={styles.grid}>
        {KEYS.map((key, i) => (
          <button
            key={i}
            type="button"
            className={key === "" ? `${styles.key} ${styles.keyEmpty}` : styles.key}
            disabled={key === "" || disabled}
            onClick={() => handleKey(key)}
          >
            {key === "back" ? "⌫" : key}
          </button>
        ))}
      </div>
    </div>
  );
}
