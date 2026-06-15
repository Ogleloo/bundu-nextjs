// ============================================================
// STAFF SERVICE — staff PIN login, owner staff management
// Used by src/components/Dashboard and src/app/dashboard/*
// ============================================================
import { createClient } from '@/lib/supabase/client';
import type { StaffMember } from '@/types';

const supabase = createClient();

/** Get all active staff (for the dashboard login name grid) */
export async function getActiveStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('active', true)
    .order('role', { ascending: false }); // owner first

  if (error) {
    console.warn('[StaffService] getActiveStaff failed:', error);
    return [];
  }
  return data as StaffMember[];
}

/** Get all staff including inactive (for the Owner management panel) */
export async function getAllStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('role', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('[StaffService] getAllStaff failed:', error);
    return [];
  }
  return data as StaffMember[];
}

export interface StaffLoginResult {
  success: boolean;
  staff?: StaffMember;
  error?: string;
}

/** Verify a staff member's name + PIN combination */
export async function staffLogin(name: string, pin: string): Promise<StaffLoginResult> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('name', name)
    .eq('pin', pin)
    .eq('active', true)
    .single();

  if (error || !data) {
    return { success: false, error: 'Incorrect PIN. Try again.' };
  }
  return { success: true, staff: data as StaffMember };
}

/** Owner: add a new staff member */
export async function addStaffMember(name: string, pin: string): Promise<{ success: boolean; error?: string }> {
  if (!name.trim() || !pin.trim()) return { success: false, error: 'Enter a name and PIN' };
  if (pin.trim().length < 4) return { success: false, error: 'PIN must be at least 4 digits' };

  const { error } = await supabase.from('staff').insert({
    name: name.trim(),
    pin: pin.trim(),
    role: 'staff',
    active: true,
  });

  if (error) {
    if (error.message.includes('duplicate')) {
      return { success: false, error: 'A staff member with that name or PIN already exists' };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}

/** Owner: toggle a staff member's active status */
export async function toggleStaffActive(id: string, active: boolean): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('staff').update({ active }).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** Owner: permanently remove a staff member */
export async function removeStaffMember(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
