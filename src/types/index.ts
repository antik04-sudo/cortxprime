export type EntryType = "standard" | "post_loss" | "mistake_of_week";

export type EntryContext = "practice" | "game";

export type TriggerTag = "after_mistake" | "nerves" | "frustration" | "low_confidence";

/**
 * Fixed shape — Phase 4 (a later, out-of-scope phase) consumes this schema directly.
 * Do not rename or restructure these seven fields.
 */
export interface JournalEntry {
  entryType: EntryType;
  context: EntryContext;
  sport: string;
  answers: { q1: string; q2: string; q3: string };
  feltWord: string | null;
  processGoal: string;
  timestamp: string;
}

/** Stored record = the fixed JournalEntry plus device-local metadata for multi-profile support. */
export interface StoredJournalEntry extends JournalEntry {
  id: number;
  profileId: string;
}

/** Same fixed JournalEntry shape, as stored in Supabase (uuid id, kid_id scoping). */
export interface SupabaseJournalEntry extends JournalEntry {
  id: string;
  profileId: string;
}

export interface Profile {
  id: string;
  name: string;
  sport: string;
  feelingWord: string;
  processGoal: string;
  createdAt: string;
}

/** A kid's Supabase-backed profile — `kids` table row shape. */
export interface KidProfile {
  id: string;
  username: string;
  sport: string | null;
  feelingWord: string | null;
  processGoal: string | null;
}

/** Public, column-limited row from the `kid_public_profiles` view (pre-login list). */
export interface KidPublicProfile {
  id: string;
  username: string;
  sport: string | null;
}

export interface SelfTalkScript {
  id: string;
  trigger: TriggerTag;
  text: string;
}

export interface FavoriteScript {
  profileId: string;
  scriptId: string;
}
