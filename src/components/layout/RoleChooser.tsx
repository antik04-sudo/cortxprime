import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { useParentAuth } from "../../state/ParentAuthContext";
import { useKidSession } from "../../state/KidSessionContext";
import { getPendingAuthLinkType } from "../../lib/authLinkType";
import Button from "../ui/Button";
import styles from "./RoleChooser.module.css";

export default function RoleChooser() {
  const { user, loading: parentLoading } = useParentAuth();
  const { kid, loading: kidLoading } = useKidSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (parentLoading || kidLoading) return;
    if (kid) {
      // RequireKidReady (on /home) bounces to /onboarding itself if setup's incomplete
      navigate("/home", { replace: true });
    } else if (user) {
      // Arrived via an invite/recovery link with no password set yet — finish
      // that before dropping them into the dashboard.
      navigate(getPendingAuthLinkType() ? "/parent/set-password" : "/parent/dashboard", { replace: true });
    }
  }, [parentLoading, kidLoading, kid, user, navigate]);

  if (parentLoading || kidLoading || kid || user) return null;

  return (
    <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-6)" }}>
      <div className="stack" style={{ gap: "var(--space-2)" }}>
        <div className={styles.wordmark}>
          <Zap size={26} className={styles.wordmarkIcon} />
          CORTX<span className={styles.wordmarkAccent}>PRIME</span>
        </div>
        <div className={styles.tagline}>Mindset OS for young athletes</div>
      </div>
      <div className="stack">
        <Button block onClick={() => navigate("/kid/login")}>
          I'm an Athlete
        </Button>
        <Button variant="secondary" block onClick={() => navigate("/parent/login")}>
          I'm a parent
        </Button>
      </div>
    </div>
  );
}
