import { useNavigate } from "react-router-dom";
import { useKidSession } from "../../state/KidSessionContext";

export default function KidLoggedInPlaceholder() {
  const { kid, loading, logout } = useKidSession();
  const navigate = useNavigate();

  if (loading) return null;

  if (!kid) {
    return (
      <div className="screen">
        <p className="text-secondary">Not logged in.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/kid/login")}>
          Go to login
        </button>
      </div>
    );
  }

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
