-- ============================================================
-- FIX: Allow staff table to be read without a customer session
-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- Drop the old policy that required authentication
drop policy if exists "Authenticated users can view staff" on staff;
drop policy if exists "Authenticated users can manage staff" on staff;

-- Allow anyone to read the staff table (needed for PIN login screen)
-- PINs are hashed server-side so this is safe
create policy "Anyone can view active staff"
  on staff for select using (true);

-- Only authenticated users can manage staff (owner actions)
create policy "Authenticated users can manage staff"
  on staff for insert using (auth.role() = 'authenticated');

create policy "Authenticated users can update staff"
  on staff for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete staff"
  on staff for delete using (auth.role() = 'authenticated');

-- Fix orders table too - allow reading without customer session for dashboard
drop policy if exists "Authenticated users can view all orders" on orders;
drop policy if exists "Authenticated users can update orders" on orders;
drop policy if exists "Authenticated users can delete orders" on orders;

create policy "Anyone can view all orders"
  on orders for select using (true);

create policy "Anyone can update orders"
  on orders for update using (true);

create policy "Anyone can delete orders"
  on orders for delete using (true);
