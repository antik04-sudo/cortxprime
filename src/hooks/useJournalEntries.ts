import { useCallback, useEffect, useState } from "react";
import type { JournalEntry, StoredJournalEntry } from "../types";
import { addEntry, listEntriesForProfile } from "../db/entriesRepo";

export function useJournalEntries(profileId: string | undefined) {
  const [entries, setEntries] = useState<StoredJournalEntry[]>([]);
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
  }, [profileId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logEntry = useCallback(
    async (entry: JournalEntry) => {
      if (!profileId) return;
      await addEntry(profileId, entry);
      await refresh();
    },
    [profileId, refresh]
  );

  return { entries, loading, logEntry, refresh };
}
