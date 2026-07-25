import { supabase } from "../../lib/supabaseClient";

export interface StreakRow {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  lastEntryDate: string | null;
}

export async function upsertStreak(kidId: string, streak: StreakRow): Promise<void> {
  const { error } = await supabase.from("streaks").upsert(
    {
      kid_id: kidId,
      current_streak: streak.currentStreak,
      longest_streak: streak.longestStreak,
      total_entries: streak.totalEntries,
      last_entry_date: streak.lastEntryDate,
    },
    { onConflict: "kid_id" }
  );

  if (error) throw error;
}
