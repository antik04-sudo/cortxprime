/**
 * Captures whether the page was just loaded from a Supabase invite or
 * password-recovery email link — must be imported before anything that
 * touches the Supabase client (see main.tsx). This app uses HashRouter,
 * which shares window.location.hash with Supabase's own hash-based session
 * detection; Supabase consumes and clears those params asynchronously and,
 * for invite links specifically, doesn't fire a distinctly-named auth event
 * the way it does for recovery (PASSWORD_RECOVERY). Reading the raw hash
 * synchronously at module-eval time — before the Supabase client is even
 * constructed — is the only reliable way to catch both cases.
 */
const initialHash = window.location.hash;

let type: "invite" | "recovery" | null = /[#&]type=invite\b/.test(initialHash)
  ? "invite"
  : /[#&]type=recovery\b/.test(initialHash)
    ? "recovery"
    : null;

export function getPendingAuthLinkType() {
  return type;
}

export function clearPendingAuthLinkType() {
  type = null;
}
