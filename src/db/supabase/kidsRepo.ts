import { supabase } from "../../lib/supabaseClient";
import type { KidProfile, KidPublicProfile } from "../../types";

interface KidRow {
  id: string;
  username: string;
  sport: string | null;
  feeling_word: string | null;
  process_goal: string | null;
}

function fromRow(row: KidRow): KidProfile {
  return {
    id: row.id,
    username: row.username,
    sport: row.sport,
    feelingWord: row.feeling_word,
    processGoal: row.process_goal,
  };
}

/** Pre-login "pick your profile" list — reads the public, column-limited view. */
export async function listKidPublicProfiles(): Promise<KidPublicProfile[]> {
  const { data, error } = await supabase
    .from("kid_public_profiles")
    .select("id, username, sport");

  if (error) throw error;
  return data as KidPublicProfile[];
}

/** The logged-in kid's own full profile (feeling word + process goal included). */
export async function getMyKidProfile(kidId: string): Promise<KidProfile | null> {
  const { data, error } = await supabase
    .from("kids")
    .select("id, username, sport, feeling_word, process_goal")
    .eq("id", kidId)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as KidRow) : null;
}

/** Kids may only ever update these two columns on their own row (DB-enforced via column grant). */
export async function updateMyKidPrefs(
  kidId: string,
  prefs: { feelingWord: string; processGoal: string }
): Promise<void> {
  const { error } = await supabase
    .from("kids")
    .update({ feeling_word: prefs.feelingWord, process_goal: prefs.processGoal })
    .eq("id", kidId);

  if (error) throw error;
}

/** Parent's own kids list — RLS scopes this to their parent_id automatically. */
export async function listMyKids(): Promise<KidProfile[]> {
  const { data, error } = await supabase
    .from("kids")
    .select("id, username, sport, feeling_word, process_goal");

  if (error) throw error;
  return (data as KidRow[]).map(fromRow);
}
