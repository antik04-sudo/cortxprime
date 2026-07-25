import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// Used only to normalize response timing when the username doesn't exist,
// so a wrong username and a wrong PIN take the same time to reject —
// never reveals whether a username is real.
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8p5AjLoOMlz36cnJp7VbEXFO9tD3AC";

const WRONG_PIN_MESSAGE = "Wrong PIN, try again";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { username, pin } = req.body ?? {};
  if (typeof username !== "string" || typeof pin !== "string") {
    res.status(400).json({ error: WRONG_PIN_MESSAGE });
    return;
  }

  const { data: kid } = await supabaseAdmin
    .from("kids")
    .select("id, username, sport, pin_hash, auth_email")
    .eq("username", username.trim())
    .maybeSingle();

  if (!kid) {
    await bcrypt.compare(pin, DUMMY_HASH);
    res.status(401).json({ error: WRONG_PIN_MESSAGE });
    return;
  }

  const pinMatches = await bcrypt.compare(pin, kid.pin_hash);
  if (!pinMatches) {
    res.status(401).json({ error: WRONG_PIN_MESSAGE });
    return;
  }

  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: kid.auth_email,
  });

  if (linkError || !linkData) {
    res.status(500).json({ error: "Could not start session" });
    return;
  }

  res.status(200).json({
    tokenHash: linkData.properties.hashed_token,
    verificationType: "magiclink",
    kid: { id: kid.id, username: kid.username, sport: kid.sport },
  });
}
