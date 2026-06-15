-- ============================================================
-- BUNDU FOODS — DATABASE SCHEMA
-- Run this once in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILES (extends Supabase Auth users with name + WhatsApp)
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  wa text not null,  -- WhatsApp number, format: 27XXXXXXXXX
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Customers can read and update their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Allow profile creation during signup
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Staff need to read customer profiles to show on dashboard (via service role or staff policy)
create policy "Authenticated users can view profiles for orders"
  on profiles for select using (auth.role() = 'authenticated');


-- ------------------------------------------------------------
-- 2. ORDERS
-- ------------------------------------------------------------
create table if not exists orders (
  id text primary key,              -- e.g. "BND-4821"
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  wa text not null,
  email text not null,
  order_details text not null,
  order_type text not null check (order_type in ('dine-in','takeaway','catering','event')),
  notes text,
  reply_pref text not null check (reply_pref in ('whatsapp','call','either')),
  status text not null default 'new' check (status in ('new','progress','done')),
  processed_by text,
  created_at timestamptz default now()
);

alter table orders enable row level security;

-- Customers can view their own orders
create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

-- Customers can create their own orders
create policy "Users can create own orders"
  on orders for insert with check (auth.uid() = user_id);

-- All authenticated users (staff included) can view all orders for the dashboard
-- NOTE: staff PIN-gate happens in the app, not via Supabase Auth roles.
create policy "Authenticated users can view all orders"
  on orders for select using (auth.role() = 'authenticated');

create policy "Authenticated users can update orders"
  on orders for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete orders"
  on orders for delete using (auth.role() = 'authenticated');


-- ------------------------------------------------------------
-- 3. STAFF (PIN-based dashboard access, managed by Owner)
-- ------------------------------------------------------------
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  pin text not null,
  role text not null default 'staff' check (role in ('owner','staff')),
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table staff enable row level security;

-- Anyone authenticated can read staff list (needed for dashboard login screen)
create policy "Authenticated users can view staff"
  on staff for select using (auth.role() = 'authenticated');

create policy "Authenticated users can manage staff"
  on staff for all using (auth.role() = 'authenticated');

-- Seed default staff (matches old system: Owner/9999, Staff 1/2025)
insert into staff (name, pin, role, active) values
  ('Owner', '9999', 'owner', true),
  ('Staff 1', '2025', 'staff', true)
on conflict (name) do nothing;


-- ------------------------------------------------------------
-- 4. MENU ITEMS
-- ------------------------------------------------------------
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,       -- "Breakfast" | "Mocktails & Cocktails" | "Milkshakes"
  name text not null,
  description text,
  price numeric(10,2) not null,
  available boolean not null default true,
  sort_order int not null default 0
);

alter table menu_items enable row level security;

create policy "Anyone can view available menu items"
  on menu_items for select using (true);

create policy "Authenticated users can manage menu"
  on menu_items for all using (auth.role() = 'authenticated');


-- ------------------------------------------------------------
-- 5. TRIGGER: auto-create profile row when a user signs up
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, wa)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'wa', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ------------------------------------------------------------
-- 6. ENABLE REALTIME (for live dashboard updates)
-- ------------------------------------------------------------
alter publication supabase_realtime add table orders;
