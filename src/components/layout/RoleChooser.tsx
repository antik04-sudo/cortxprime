import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAuth } from "../../state/ParentAuthContext";
import { useKidSession } from "../../state/KidSessionContext";

export default function RoleChooser() {
  const { user, loading: parentLoading } = useParentAuth();
  const { kid, loading: kidLoading } = useKidSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (parentLoading || kidLoading) return;
    if (kid) {
      navigate("/kid/home", { replace: true });
    } else if (user) {
      navigate("/parent/dashboard", { replace: true });
    }
  }, [parentLoading, kidLoading, kid, user, navigate]);

  if (parentLoading || kidLoading || kid || user) return null;

  return (
    <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-6)" }}>
      <h1 style={{ fontSize: "var(--text-2xl)" }}>Welcome to CortXPrime</h1>
      <div className="stack">
        <button type="button" className="btn btn-primary btn-block" onClick={() => navigate("/kid/login")}>
          I'm a kid
        </button>
        <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate("/parent/login")}>
          I'm a parent
        </button>
      </div>
    </div>
  );
}
