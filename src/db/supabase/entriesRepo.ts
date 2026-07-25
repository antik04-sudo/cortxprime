import { supabase } from "../../lib/supabaseClient";
import type { JournalEntry, SupabaseJournalEntry } from "../../types";

interface EntryRow {
  id: string;
  kid_id: string;
  entry_type: JournalEntry["entryType"];
  context: JournalEntry["context"];
  sport: string;
  answers: JournalEntry["answers"];
  felt_word: string | null;
  process_goal: string;
  timestamp: string;
}

function fromRow(row: EntryRow): SupabaseJournalEntry {
  return {
    id: row.id,
    profileId: row.kid_id,
    entryType: row.entry_type,
    context: row.context,
    sport: row.sport,
    answers: row.answers,
    feltWord: row.felt_word,
    processGoal: row.process_goal,
    timestamp: row.timestamp,
  };
}

export async function addEntry(kidId: string, entry: JournalEntry): Promise<string> {
  const { data, error } = await supabase
    .from("entries")
    .insert({
      kid_id: kidId,
      entry_type: entry.entryType,
      context: entry.context,
      sport: entry.sport,
      answers: entry.answers,
      felt_word: entry.feltWord,
      process_goal: entry.processGoal,
      timestamp: entry.timestamp,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function listEntriesForProfile(kidId: string): Promise<SupabaseJournalEntry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("kid_id", kidId)
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return (data as EntryRow[]).map(fromRow);
}
