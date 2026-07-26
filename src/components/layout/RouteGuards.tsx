import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";
import { useKidSession } from "../../state/KidSessionContext";

export function RequireParent({ children }: { children: ReactNode }) {
  const { user, loading } = useParentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/parent/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) return null;
  return <>{children}</>;
}

export function RequireKid({ children }: { children: ReactNode }) {
  const { kid, loading } = useKidSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !kid) navigate("/kid/login", { replace: true });
  }, [loading, kid, navigate]);

  if (loading || !kid) return null;
  return <>{children}</>;
}

/** Needs a kid session AND completed first-time setup (feeling word + process
 * goal) — used by /home, /journal/*, /self-talk, /progress. Bounces to
 * /onboarding (itself only wrapped in the more lenient RequireKid, to avoid
 * a redirect loop) when setup isn't done yet. */
export function RequireKidReady({ children }: { children: ReactNode }) {
  const { kid, loading } = useKidSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!kid) {
      navigate("/kid/login", { replace: true });
    } else if (!kid.feelingWord || !kid.processGoal) {
      navigate("/onboarding", { replace: true });
    }
  }, [loading, kid, navigate]);

  if (loading || !kid || !kid.feelingWord || !kid.processGoal) return null;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useParentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/parent/login", { replace: true });
    else if (!isAdmin) navigate("/parent/dashboard", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user || !isAdmin) return null;
  return <>{children}</>;
}
