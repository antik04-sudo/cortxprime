import { getDB } from "./db";
import type { Profile } from "../types";

export interface LocalProfileSummary {
  profile: Profile;
  entryCount: number;
  favoriteCount: number;
}

/** Quick check so callers can skip touching IndexedDB at all when there's nothing there. */
export async function hasAnyLocalData(): Promise<boolean> {
  const db = await getDB();
  const count = await db.count("profiles");
  return count > 0;
}

export async function getLocalProfilesSummary(): Promise<LocalProfileSummary[]> {
  const db = await getDB();
  const profiles = await db.getAll("profiles");

  return Promise.all(
    profiles.map(async (profile) => {
      const entries = await db.getAllFromIndex("entries", "by-profile", profile.id);
      const favorites = await db.getAllFromIndex("favorites", "by-profile", profile.id);
      return { profile, entryCount: entries.length, favoriteCount: favorites.length };
    })
  );
}

export async function getLocalEntriesForProfile(profileId: string) {
  const db = await getDB();
  return db.getAllFromIndex("entries", "by-profile", profileId);
}

export async function getLocalFavoritesForProfile(profileId: string) {
  const db = await getDB();
  return db.getAllFromIndex("favorites", "by-profile", profileId);
}

/** Wipes one local profile's entries, favorites, and the profile record itself. */
export async function clearLocalProfileData(profileId: string): Promise<void> {
  const db = await getDB();

  const entries = await db.getAllFromIndex("entries", "by-profile", profileId);
  const entryTx = db.transaction("entries", "readwrite");
  await Promise.all(entries.map((e) => entryTx.store.delete(e.id)));
  await entryTx.done;

  const favorites = await db.getAllFromIndex("favorites", "by-profile", profileId);
  const favoriteTx = db.transaction("favorites", "readwrite");
  await Promise.all(favorites.map((f) => favoriteTx.store.delete([f.profileId, f.scriptId])));
  await favoriteTx.done;

  await db.delete("profiles", profileId);
}

const HANDLED_KEY_PREFIX = "cortxprime:migration-handled:";

export function isMigrationHandled(kidId: string): boolean {
  return localStorage.getItem(HANDLED_KEY_PREFIX + kidId) === "1";
}

export function markMigrationHandled(kidId: string): void {
  localStorage.setItem(HANDLED_KEY_PREFIX + kidId, "1");
}
