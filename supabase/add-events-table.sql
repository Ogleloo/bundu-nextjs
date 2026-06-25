-- ============================================================
-- ADD EVENTS TABLE
-- Run in Supabase Dashboard -> SQL Editor -> New Query
-- You add events via Supabase Table Editor -> events table
-- ============================================================

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  poster_url text,        -- URL to poster image (upload to Supabase Storage)
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table events enable row level security;

-- Anyone can view active events (public page, no login needed)
create policy "Anyone can view active events"
  on events for select using (active = true);

-- Only authenticated users (you, via Supabase dashboard) can manage events
create policy "Authenticated users can manage events"
  on events for all using (auth.role() = 'authenticated');

-- Enable realtime on events
alter publication supabase_realtime add table events;
