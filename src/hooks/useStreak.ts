import { useMemo } from "react";
import { computeStreak } from "../utils/streak";

export function useStreak(entries: { timestamp: string }[]) {
  return useMemo(
    () => computeStreak(entries.map((e) => e.timestamp)),
    [entries]
  );
}
