import { getDB } from "./db";
import type { JournalEntry, StoredJournalEntry } from "../types";

export async function addEntry(
  profileId: string,
  entry: JournalEntry
): Promise<number> {
  const db = await getDB();
  return db.add("entries", { ...entry, profileId } as StoredJournalEntry);
}

export async function listEntriesForProfile(
  profileId: string
): Promise<StoredJournalEntry[]> {
  const db = await getDB();
  const entries = await db.getAllFromIndex("entries", "by-profile", profileId);
  return entries.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}
