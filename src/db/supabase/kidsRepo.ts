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

/**
 * Parent's own kids list. Filters on parent_id explicitly rather than relying
 * on RLS alone — the admin account also matches the broader kids_admin_read
 * policy (auth.uid() = admin UUID, no parent_id restriction), so RLS-only
 * scoping would leak every family's kids into the admin's own "my kids" view.
 */
export async function listMyKids(): Promise<KidProfile[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw userError ?? new Error("Not signed in");

  const { data, error } = await supabase
    .from("kids")
    .select("id, username, sport, feeling_word, process_goal")
    .eq("parent_id", userData.user.id);

  if (error) throw error;
  return (data as KidRow[]).map(fromRow);
}
