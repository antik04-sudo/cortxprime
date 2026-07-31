import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const MAX_KIDS_PER_PARENT = 2;
const PIN_PATTERN = /^\d{4}$/;

// Service-role client for privileged operations (bypasses RLS): counting kids,
// creating the synthetic auth user, inserting the kids row.
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// Anon-keyed client used only to verify the parent's own JWT via getUser(token).
// Deliberately separate from supabaseAdmin — passing a foreign user's token to
// a client already configured with the service_role key doesn't reliably
// validate it the same way (confirmed: Supabase's own /auth/v1/user accepted
// the token directly, but supabaseAdmin.auth.getUser(token) rejected it).
const supabaseAuthCheck = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const authHeader = req.headers.authorization;
  const parentToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!parentToken) {
    res.status(401).json({ error: "Missing parent session" });
    return;
  }

  const { data: userData, error: userError } = await supabaseAuthCheck.auth.getUser(parentToken);
  if (userError || !userData.user) {
    res.status(401).json({ error: "Invalid parent session" });
    return;
  }
  const parentId = userData.user.id;

  const { pin, sport } = req.body ?? {};
  const trimmedSport = typeof sport === "string" ? sport.trim() : "";

  if (typeof pin !== "string" || !PIN_PATTERN.test(pin)) {
    res.status(400).json({ error: "PIN must be exactly 4 digits" });
    return;
  }
  if (!trimmedSport) {
    res.status(400).json({ error: "Sport is required" });
    return;
  }

  const { data: existingKids, error: countError } = await supabaseAdmin
    .from("kids")
    .select("id")
    .eq("parent_id", parentId);
  if (countError) {
    res.status(500).json({ error: "Could not check existing profiles" });
    return;
  }
  if ((existingKids?.length ?? 0) >= MAX_KIDS_PER_PARENT) {
    res.status(400).json({ error: `Maximum ${MAX_KIDS_PER_PARENT} kid profiles per account` });
    return;
  }

  // Parents no longer choose the athlete's username (minimizing PII collected
  // up front) — a placeholder is generated here and the athlete picks their
  // own real username during onboarding (see OnboardingFlow.tsx).
  let placeholderUsername = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `NewAthlete${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: matches, error: checkError } = await supabaseAdmin
      .from("kids")
      .select("id")
      .eq("username", candidate);
    if (checkError) {
      res.status(500).json({ error: "Could not generate username" });
      return;
    }
    if ((matches?.length ?? 0) === 0) {
      placeholderUsername = candidate;
      break;
    }
  }
  if (!placeholderUsername) {
    res.status(500).json({ error: "Could not generate a unique username, try again" });
    return;
  }

  const pinHash = await bcrypt.hash(pin, 10);
  const syntheticEmail = `kid-${crypto.randomUUID()}@kids.cortxprime.internal`;
  const syntheticPassword = crypto.randomBytes(32).toString("hex");

  const { data: createdUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
    email: syntheticEmail,
    password: syntheticPassword,
    email_confirm: true,
  });
  if (createUserError || !createdUser.user) {
    res.status(500).json({ error: "Could not create kid account" });
    return;
  }
  const kidAuthId = createdUser.user.id;

  const { data: kidRow, error: insertError } = await supabaseAdmin
    .from("kids")
    .insert({
      id: kidAuthId,
      parent_id: parentId,
      username: placeholderUsername,
      pin_hash: pinHash,
      sport: trimmedSport,
      auth_email: syntheticEmail,
    })
    .select("id, username, sport")
    .single();

  if (insertError || !kidRow) {
    // Roll back the orphaned auth user so we don't leak accounts with no kid row
    await supabaseAdmin.auth.admin.deleteUser(kidAuthId);
    res.status(500).json({ error: "Could not create kid profile" });
    return;
  }

  res.status(201).json({ kid: kidRow });
}
