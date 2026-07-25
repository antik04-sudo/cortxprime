import { useCallback, useEffect, useState } from "react";
import { listFavoriteScriptIds, toggleFavorite } from "../db/favoritesRepo";

export function useFavorites(profileId: string | undefined) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    const ids = await listFavoriteScriptIds(profileId);
    setFavoriteIds(new Set(ids));
    setLoading(false);
  }, [profileId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (scriptId: string) => {
      if (!profileId) return;
      const isFavorited = favoriteIds.has(scriptId);
      await toggleFavorite(profileId, scriptId, isFavorited);
      await refresh();
    },
    [profileId, favoriteIds, refresh]
  );

  return { favoriteIds, loading, toggle };
}
