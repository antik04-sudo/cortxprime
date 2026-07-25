import { useMemo } from "react";
import type { StoredJournalEntry } from "../types";
import { computeStreak } from "../utils/streak";

export function useStreak(entries: StoredJournalEntry[]) {
  return useMemo(
    () => computeStreak(entries.map((e) => e.timestamp)),
    [entries]
  );
}
