import { getDB } from "./db";
import type { Profile } from "../types";

export async function listProfiles(): Promise<Profile[]> {
  const db = await getDB();
  return db.getAll("profiles");
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const db = await getDB();
  return db.get("profiles", id);
}

export async function createProfile(profile: Profile): Promise<void> {
  const db = await getDB();
  await db.put("profiles", profile);
}

export async function updateProfile(profile: Profile): Promise<void> {
  const db = await getDB();
  await db.put("profiles", profile);
}
