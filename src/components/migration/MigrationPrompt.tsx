import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKidSession } from "../../state/KidSessionContext";
import {
  getLocalProfilesSummary,
  getLocalEntriesForProfile,
  getLocalFavoritesForProfile,
  clearLocalProfileData,
  markMigrationHandled,
  type LocalProfileSummary,
} from "../../db/migrationRepo";
import { addEntry } from "../../db/supabase/entriesRepo";
import { toggleFavorite } from "../../db/supabase/favoritesRepo";
import { upsertStreak } from "../../db/supabase/streaksRepo";
import { updateMyKidPrefs } from "../../db/supabase/kidsRepo";
import { computeStreak } from "../../utils/streak";
import { dayKey } from "../../utils/date";

export default function MigrationPrompt() {
  const { kid, refreshKid } = useKidSession();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<LocalProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyProfileId, setBusyProfileId] = useState<string | null>(null);

  useEffect(() => {
    getLocalProfilesSummary().then((summaries) => {
      setProfiles(summaries);
      setLoading(false);
      if (summaries.length === 0 && kid) {
        markMigrationHandled(kid.id);
        navigate("/home", { replace: true });
      }
    });
  }, [kid, navigate]);

  if (!kid) return null;

  async function handleMigrate(summary: LocalProfileSummary) {
    setBusyProfileId(summary.profile.id);

    const localEntries = await getLocalEntriesForProfile(summary.profile.id);
    const localFavorites = await getLocalFavoritesForProfile(summary.profile.id);

    for (const { id: _id, profileId: _profileId, ...entry } of localEntries) {
      await addEntry(kid!.id, entry);
    }
    for (const favorite of localFavorites) {
      await toggleFavorite(kid!.id, favorite.scriptId, false);
    }

    if (localEntries.length > 0) {
      const streak = computeStreak(localEntries.map((e) => e.timestamp));
      const lastEntry = localEntries[localEntries.length - 1];
      await upsertStreak(kid!.id, {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        totalEntries: streak.totalEntries,
        lastEntryDate: dayKey(lastEntry.timestamp),
      });
    }

    await updateMyKidPrefs(kid!.id, {
      feelingWord: summary.profile.feelingWord,
      processGoal: summary.profile.processGoal,
    });

    await clearLocalProfileData(summary.profile.id);
    markMigrationHandled(kid!.id);
    await refreshKid();
    navigate("/home");
  }

  function handleSkip() {
    markMigrationHandled(kid!.id);
    navigate("/home");
  }

  return (
    <div className="screen">
      <h1 style={{ fontSize: "var(--text-xl)" }}>Found saved data on this device</h1>
      <p className="text-secondary">
        Looks like there's journal data saved locally from before. Was one of these you?
      </p>

      {loading ? (
        <p className="text-secondary">Loading…</p>
      ) : (
        <div className="stack">
          {profiles.map((summary) => (
            <div key={summary.profile.id} className="card stack">
              <div>
                <strong style={{ fontFamily: "var(--font-heading)" }}>{summary.profile.name}</strong>
                <br />
                <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                  {summary.profile.sport} · {summary.entryCount} entries · {summary.favoriteCount} favorites
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-block"
                disabled={busyProfileId !== null}
                onClick={() => handleMigrate(summary)}
              >
                {busyProfileId === summary.profile.id ? "Migrating…" : "This was me"}
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn btn-secondary btn-block"
        disabled={busyProfileId !== null}
        onClick={handleSkip}
      >
        None of these were me
      </button>
    </div>
  );
}
