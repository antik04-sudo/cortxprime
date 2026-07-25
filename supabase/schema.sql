-- CortXPrime — Supabase schema + RLS (Phase 2, Step 1)
-- Run this in the Supabase SQL Editor after creating the project and your own
-- admin/parent user (Authentication → Users → Add user). Replace <ADMIN_UUID>
-- below (two places per table) with that user's UUID before running.

-- KIDS
create table public.kids (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  username text not null unique,        -- unique: the kid-login screen shows one global list by name
  pin_hash text not null,                -- bcrypt hash, cost factor 10+, never plaintext
  sport text,
  created_at timestamptz not null default now()
);
alter table public.kids enable row level security;

-- Public, column-limited view for the pre-login "pick your profile" list.
-- RLS is row-level, not column-level — granting anon SELECT on kids directly would
-- also expose pin_hash. This view is the only thing the anon/public key can read.
create view public.kid_public_profiles as
  select id, username, sport from public.kids;
grant select on public.kid_public_profiles to anon, authenticated;

create policy "kids_self_read" on public.kids
  for select using (id = auth.uid());
create policy "kids_parent_manage" on public.kids
  for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy "kids_admin_read" on public.kids
  for select using (auth.uid() = '<ADMIN_UUID>');

-- ENTRIES
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  kid_id uuid not null references public.kids(id) on delete cascade,
  entry_type text not null check (entry_type in ('standard','post_loss','mistake_of_week')),
  context text check (context in ('practice','game')),
  sport text,
  answers jsonb not null,
  felt_word text,
  process_goal text,
  timestamp timestamptz not null default now()
);
alter table public.entries enable row level security;

create policy "entries_kid_manage" on public.entries
  for all using (kid_id = auth.uid()) with check (kid_id = auth.uid());
create policy "entries_parent_read" on public.entries
  for select using (kid_id in (select id from public.kids where parent_id = auth.uid()));
create policy "entries_admin_read" on public.entries
  for select using (auth.uid() = '<ADMIN_UUID>');

-- STREAKS
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  kid_id uuid not null unique references public.kids(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  total_entries int not null default 0,
  last_entry_date date
);
alter table public.streaks enable row level security;

create policy "streaks_kid_manage" on public.streaks
  for all using (kid_id = auth.uid()) with check (kid_id = auth.uid());
create policy "streaks_parent_read" on public.streaks
  for select using (kid_id in (select id from public.kids where parent_id = auth.uid()));
create policy "streaks_admin_read" on public.streaks
  for select using (auth.uid() = '<ADMIN_UUID>');

-- FAVORITES (added beyond the originally given schema — Phase 1's self-talk
-- favoriting feature would otherwise silently stop syncing across a kid's devices)
create table public.favorites (
  kid_id uuid not null references public.kids(id) on delete cascade,
  script_id text not null,
  primary key (kid_id, script_id)
);
alter table public.favorites enable row level security;

create policy "favorites_kid_manage" on public.favorites
  for all using (kid_id = auth.uid()) with check (kid_id = auth.uid());
create policy "favorites_parent_read" on public.favorites
  for select using (kid_id in (select id from public.kids where parent_id = auth.uid()));
create policy "favorites_admin_read" on public.favorites
  for select using (auth.uid() = '<ADMIN_UUID>');

-- ADDED after initial run: Phase 1's onboarding collects a feeling word + a
-- default process goal per kid (used to snapshot entries.process_goal on each
-- journal entry) — the originally-given kids schema had no column for these.
alter table public.kids
  add column feeling_word text,
  add column process_goal text;

-- Kids may update ONLY these two columns on their own row — not username,
-- sport, pin_hash, or parent_id. RLS's row-check alone wouldn't stop that
-- (any authenticated update to their own row would pass "id = auth.uid()"),
-- so the column-level grant is what actually narrows it.
create policy "kids_self_update_prefs" on public.kids
  for update using (id = auth.uid()) with check (id = auth.uid());

revoke update on public.kids from authenticated;
grant update (feeling_word, process_goal) on public.kids to authenticated;

-- ADDED: (1) auth_email — the login endpoint needs to look up the kid's
-- synthetic Supabase Auth email by username to generate their magic link;
-- storing it avoids re-deriving anything fragile. Server-only, never selected
-- by client code. (2) Column-level SELECT lockdown on kids — RLS only
-- filters ROWS, so without this, a kid's own "select pin_hash" would have
-- passed RLS and returned their hash. The kid_public_profiles view is
-- unaffected: Postgres views run with the view owner's privileges by
-- default, not the querying role's, so this doesn't touch it.
alter table public.kids add column auth_email text;

revoke select on public.kids from authenticated, anon;
grant select (id, parent_id, username, sport, feeling_word, process_goal)
  on public.kids to authenticated;
