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
