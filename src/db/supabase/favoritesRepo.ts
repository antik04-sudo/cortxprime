import { supabase } from "../../lib/supabaseClient";

export async function listFavoriteScriptIds(kidId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("script_id")
    .eq("kid_id", kidId);

  if (error) throw error;
  return data.map((row) => row.script_id as string);
}

export async function toggleFavorite(
  kidId: string,
  scriptId: string,
  isFavorited: boolean
): Promise<void> {
  if (isFavorited) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("kid_id", kidId)
      .eq("script_id", scriptId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ kid_id: kidId, script_id: scriptId });
    if (error) throw error;
  }
}
