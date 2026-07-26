import { useNavigate } from "react-router-dom";
import { useKidSession } from "../../state/KidSessionContext";

export default function KidLoggedInPlaceholder() {
  const { kid, logout } = useKidSession();
  const navigate = useNavigate();

  // RequireKid (App.tsx) guarantees a kid is loaded before this renders
  if (!kid) return null;

  return (
    <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-5)" }}>
      <h1 style={{ fontSize: "var(--text-xl)" }}>Logged in as {kid.username}</h1>
      <p className="text-secondary">Sport: {kid.sport ?? "not set"}</p>
      <button
        type="button"
        className="btn btn-secondary btn-block"
        onClick={async () => {
          await logout();
          navigate("/kid/login");
        }}
      >
        Log out
      </button>
    </div>
  );
}
