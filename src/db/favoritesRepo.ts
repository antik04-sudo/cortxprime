import { getDB } from "./db";

export async function listFavoriteScriptIds(profileId: string): Promise<string[]> {
  const db = await getDB();
  const favorites = await db.getAllFromIndex("favorites", "by-profile", profileId);
  return favorites.map((f) => f.scriptId);
}

export async function toggleFavorite(
  profileId: string,
  scriptId: string,
  isFavorited: boolean
): Promise<void> {
  const db = await getDB();
  if (isFavorited) {
    await db.delete("favorites", [profileId, scriptId]);
  } else {
    await db.put("favorites", { profileId, scriptId });
  }
}
