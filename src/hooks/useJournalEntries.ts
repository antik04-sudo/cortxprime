import { useCallback, useEffect, useState } from "react";
import type { JournalEntry, SupabaseJournalEntry } from "../types";
import { addEntry, listEntriesForProfile } from "../db/supabase/entriesRepo";
import { upsertStreak } from "../db/supabase/streaksRepo";
import { computeStreak } from "../utils/streak";
import { dayKey } from "../utils/date";

export function useJournalEntries(profileId: string | undefined) {
  const [entries, setEntries] = useState<SupabaseJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const all = await listEntriesForProfile(profileId);
    setEntries(all);
    setLoading(false);
    return all;
  }, [profileId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logEntry = useCallback(
    async (entry: JournalEntry) => {
      if (!profileId) return;
      await addEntry(profileId, entry);
      const updated = await refresh();
      if (updated) {
        const streak = computeStreak(updated.map((e) => e.timestamp));
        const lastEntry = updated[updated.length - 1];
        await upsertStreak(profileId, {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          totalEntries: streak.totalEntries,
          lastEntryDate: lastEntry ? dayKey(lastEntry.timestamp) : null,
        });
      }
    },
    [profileId, refresh]
  );

  return { entries, loading, logEntry, refresh };
}
