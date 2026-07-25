export default function JournalCompletion({
  message,
  onContinue,
}: {
  message: string;
  onContinue: () => void;
}) {
  return (
    <div className="screen" style={{ justifyContent: "center", textAlign: "center", gap: "var(--space-6)" }}>
      <h1 style={{ fontSize: "var(--text-2xl)" }}>{message}</h1>
      <button type="button" className="btn btn-primary btn-block" onClick={onContinue}>
        Done
      </button>
    </div>
  );
}
