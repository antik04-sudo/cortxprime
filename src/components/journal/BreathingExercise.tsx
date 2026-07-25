import { useEffect, useState } from "react";
import { postLoss } from "../../content/copy";
import styles from "./BreathingExercise.module.css";

const PHASES = [
  { key: "in", label: "Breathe in", scale: 1.4 },
  { key: "hold1", label: "Hold", scale: 1.4 },
  { key: "out", label: "Breathe out", scale: 0.75 },
  { key: "hold2", label: "Hold", scale: 0.75 },
] as const;

const PHASE_SECONDS = 4;
const TOTAL_ROUNDS = 4;
const TOTAL_STEPS = PHASES.length * TOTAL_ROUNDS;

export default function BreathingExercise({ onComplete }: { onComplete: () => void }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0); // 0..TOTAL_STEPS-1
  const [secondsLeft, setSecondsLeft] = useState(PHASE_SECONDS);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        setStep((prevStep) => {
          if (prevStep >= TOTAL_STEPS - 1) {
            setFinished(true);
            return prevStep;
          }
          return prevStep + 1;
        });
        return PHASE_SECONDS;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, finished]);

  useEffect(() => {
    if (!finished) return;
    const timeout = setTimeout(onComplete, 500);
    return () => clearTimeout(timeout);
  }, [finished, onComplete]);

  if (!started) {
    return (
      <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--text-xl)" }}>{postLoss.breathingIntro}</h1>
        <button type="button" className="btn btn-primary btn-block" onClick={() => setStarted(true)}>
          Start
        </button>
      </div>
    );
  }

  const round = Math.floor(step / PHASES.length) + 1;
  const phase = PHASES[step % PHASES.length];

  return (
    <div className="screen">
      <div className={styles.stage}>
        <span className={styles.roundLabel}>
          Round {round} of {TOTAL_ROUNDS}
        </span>
        <div className={styles.circleWrap}>
          <div className={styles.circle} style={{ transform: `scale(${phase.scale})` }}>
            <span className={styles.circleCount}>{secondsLeft}</span>
          </div>
        </div>
        <span className={styles.phaseLabel}>{phase.label}</span>
        <p className="text-secondary text-center">{postLoss.breathingOnScreen}</p>
      </div>
    </div>
  );
}
