import { Navigate } from "react-router-dom";
import { useActiveProfile } from "../../state/ActiveProfileContext";
import ProfileSwitcher from "./ProfileSwitcher";

export default function ProfileGate() {
  const { profiles, activeProfile, loading } = useActiveProfile();

  if (loading) return null;
  if (activeProfile) return <Navigate to="/home" replace />;
  if (profiles.length === 0) return <Navigate to="/onboarding" replace />;

  return (
    <div className="screen">
      <ProfileSwitcher />
    </div>
  );
}
