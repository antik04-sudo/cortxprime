import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { StoredJournalEntry, Profile, FavoriteScript } from "../types";

interface SportsMindsetDB extends DBSchema {
  profiles: {
    key: string;
    value: Profile;
  };
  entries: {
    key: number;
    value: StoredJournalEntry;
    indexes: { "by-profile": string };
  };
  favorites: {
    key: [string, string];
    value: FavoriteScript;
    indexes: { "by-profile": string };
  };
}

const DB_NAME = "sports-mindset";
// v2: JournalEntry gained a required `context` field. No real user data exists yet,
// so old entries (missing `context`) are simply wiped on upgrade instead of migrated.
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<SportsMindsetDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<SportsMindsetDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        if (!db.objectStoreNames.contains("profiles")) {
          db.createObjectStore("profiles", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("entries")) {
          const entries = db.createObjectStore("entries", {
            keyPath: "id",
            autoIncrement: true,
          });
          entries.createIndex("by-profile", "profileId");
        }

        if (!db.objectStoreNames.contains("favorites")) {
          const favorites = db.createObjectStore("favorites", {
            keyPath: ["profileId", "scriptId"],
          });
          favorites.createIndex("by-profile", "profileId");
        }

        if (oldVersion < 2) {
          transaction.objectStore("entries").clear();
        }
      },
    });
  }
  return dbPromise;
}
