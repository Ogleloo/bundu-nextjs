-- ============================================================
-- ORDERS: allow guest checkout (user_id nullable)
-- Run in: Supabase Dashboard -> SQL Editor -> New Query
--
-- AuthGuard has been removed from /orders so a customer can order
-- without an account (see src/app/orders/page.tsx, src/components/
-- Orders/OrderForm.tsx). A guest order is inserted with user_id
-- null; name + WhatsApp are collected on the form and required,
-- so the row still carries everything the kitchen dashboard needs.
--
-- This migration ONLY drops the NOT NULL. It is not enough on its
-- own — the current INSERT policy is
--   "Users can create own orders"  WITH CHECK (auth.uid() = user_id)
-- which a guest (auth.uid() null) cannot satisfy, so guest inserts
-- still fail until the RLS policies are updated. Those changes are
-- written up for review separately, NOT applied here.
-- ============================================================

alter table orders alter column user_id drop not null;

-- Note: user_id still references profiles(id) ON DELETE CASCADE.
-- A null user_id simply isn't covered by the FK, which is the intent
-- for guest rows.
