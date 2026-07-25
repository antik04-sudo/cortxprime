import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Profile } from "../types";
import { listProfiles, createProfile as dbCreateProfile, updateProfile as dbUpdateProfile } from "../db/profilesRepo";

const ACTIVE_PROFILE_KEY = "sports-mindset:active-profile-id";

interface ActiveProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  loading: boolean;
  selectProfile: (id: string) => void;
  clearActiveProfile: () => void;
  addProfile: (profile: Profile) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const ActiveProfileContext = createContext<ActiveProfileContextValue | null>(null);

export function ActiveProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() =>
    localStorage.getItem(ACTIVE_PROFILE_KEY)
  );
  const [loading, setLoading] = useState(true);

  const refreshProfiles = useCallback(async () => {
    const all = await listProfiles();
    setProfiles(all);
  }, []);

  useEffect(() => {
    refreshProfiles().finally(() => setLoading(false));
  }, [refreshProfiles]);

  const selectProfile = useCallback((id: string) => {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    setActiveProfileId(id);
  }, []);

  const clearActiveProfile = useCallback(() => {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
    setActiveProfileId(null);
  }, []);

  const addProfile = useCallback(
    async (profile: Profile) => {
      await dbCreateProfile(profile);
      await refreshProfiles();
      selectProfile(profile.id);
    },
    [refreshProfiles, selectProfile]
  );

  const updateProfile = useCallback(
    async (profile: Profile) => {
      await dbUpdateProfile(profile);
      await refreshProfiles();
    },
    [refreshProfiles]
  );

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? null,
    [profiles, activeProfileId]
  );

  const value: ActiveProfileContextValue = {
    profiles,
    activeProfile,
    loading,
    selectProfile,
    clearActiveProfile,
    addProfile,
    updateProfile,
    refreshProfiles,
  };

  return (
    <ActiveProfileContext.Provider value={value}>
      {children}
    </ActiveProfileContext.Provider>
  );
}

export function useActiveProfile() {
  const ctx = useContext(ActiveProfileContext);
  if (!ctx) throw new Error("useActiveProfile must be used within ActiveProfileProvider");
  return ctx;
}
