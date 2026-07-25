import { useNavigate } from "react-router-dom";
import { useActiveProfile } from "../../state/ActiveProfileContext";

export default function ProfileSwitcher() {
  const { profiles, activeProfile, selectProfile } = useActiveProfile();
  const navigate = useNavigate();

  function handleSelect(id: string) {
    selectProfile(id);
    navigate("/home");
  }

  return (
    <div className="stack">
      <h1>Who's this?</h1>
      <p className="text-secondary">Pick your profile, or set up a new one.</p>
      <div className="stack">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              border:
                activeProfile?.id === profile.id
                  ? "1px solid var(--accent)"
                  : undefined,
            }}
            onClick={() => handleSelect(profile.id)}
          >
            <span>
              <strong style={{ fontFamily: "var(--font-heading)" }}>
                {profile.name}
              </strong>
              <br />
              <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                {profile.sport}
              </span>
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-secondary btn-block"
        onClick={() => navigate("/onboarding")}
      >
        + New profile
      </button>
    </div>
  );
}
