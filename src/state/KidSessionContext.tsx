import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { getMyKidProfile } from "../db/supabase/kidsRepo";
import type { KidProfile } from "../types";

interface KidSessionContextValue {
  kid: KidProfile | null;
  loading: boolean;
  loginWithTokenHash: (tokenHash: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshKid: () => Promise<void>;
}

const KidSessionContext = createContext<KidSessionContextValue | null>(null);

export function KidSessionProvider({ children }: { children: ReactNode }) {
  const [kid, setKid] = useState<KidProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadKidForSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) {
      setKid(null);
      setLoading(false);
      return;
    }
    const profile = await getMyKidProfile(userId);
    setKid(profile);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadKidForSession();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadKidForSession();
    });
    return () => listener.subscription.unsubscribe();
  }, [loadKidForSession]);

  async function loginWithTokenHash(tokenHash: string) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "magiclink",
    });
    if (error) return { error: error.message };
    await loadKidForSession();
    return { error: null };
  }

  async function logout() {
    await supabase.auth.signOut();
    setKid(null);
  }

  return (
    <KidSessionContext.Provider
      value={{ kid, loading, loginWithTokenHash, logout, refreshKid: loadKidForSession }}
    >
      {children}
    </KidSessionContext.Provider>
  );
}

export function useKidSession() {
  const ctx = useContext(KidSessionContext);
  if (!ctx) throw new Error("useKidSession must be used within KidSessionProvider");
  return ctx;
}
