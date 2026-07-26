import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const supabaseAuthCheck = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

interface Family {
  parentId: string;
  parentEmail: string | null;
  kids: { id: string; username: string; sport: string | null }[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Missing session" });
    return;
  }

  // Server-side admin check — never trust a client-side flag alone for a
  // privileged endpoint like this one.
  const { data: userData, error: userError } = await supabaseAuthCheck.auth.getUser(token);
  if (userError || !userData.user) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }
  if (userData.user.id !== process.env.VITE_ADMIN_USER_ID) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const { data: kids, error: kidsError } = await supabaseAdmin
    .from("kids")
    .select("id, username, sport, parent_id");
  if (kidsError) {
    res.status(500).json({ error: "Could not load kids" });
    return;
  }

  const parentIds = [...new Set(kids.map((k) => k.parent_id))];
  const emailByParentId = new Map<string, string | null>();

  for (const parentId of parentIds) {
    const { data: userResult } = await supabaseAdmin.auth.admin.getUserById(parentId);
    emailByParentId.set(parentId, userResult?.user?.email ?? null);
  }

  const families: Family[] = parentIds.map((parentId) => ({
    parentId,
    parentEmail: emailByParentId.get(parentId) ?? null,
    kids: kids
      .filter((k) => k.parent_id === parentId)
      .map((k) => ({ id: k.id, username: k.username, sport: k.sport })),
  }));

  res.status(200).json({ families });
}
