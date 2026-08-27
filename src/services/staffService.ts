// ============================================================
// STAFF SERVICE — staff PIN login, owner staff management
// Used by src/components/Dashboard and src/app/dashboard/*,
// src/app/staff-login
//
// Every function here calls a server route under /api/staff/*.
// This file never touches Supabase directly and never sees a
// PIN except the one the caller is submitting to log in or add
// a staff member — the staff table itself is only ever read or
// written server-side, with the service role key. See
// src/app/api/staff/* for the actual data access.
// ============================================================
import type { StaffSummary, StaffRole } from '@/types';

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  return res.json() as Promise<T>;
}

export interface StaffLoginResult {
  success: boolean;
  staff?: { id: string; name: string; role: StaffRole };
  error?: string;
}

/** Verify a staff member's name + PIN combination against the server */
export async function staffLogin(name: string, pin: string): Promise<StaffLoginResult> {
  try {
    return await postJson<StaffLoginResult>('/api/staff/login', { name, pin });
  } catch {
    return { success: false, error: 'Something went wrong. Try again.' };
  }
}

/** Clear the server-side session cookie */
export async function staffLogout(): Promise<void> {
  try {
    await fetch('/api/staff/logout', { method: 'POST' });
  } catch {
    // best-effort — the cookie expires on its own regardless
  }
}

/** The currently logged-in staff member, re-verified server-side, or null */
export async function getCurrentStaff(): Promise<StaffSummary | null> {
  try {
    const res = await fetch('/api/staff/me', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? (json.staff as StaffSummary) : null;
  } catch {
    return null;
  }
}

/** Get all active staff (for the /staff-login name grid) */
export async function getActiveStaff(): Promise<StaffSummary[]> {
  try {
    const res = await fetch('/api/staff/list', { cache: 'no-store' });
    const json = await res.json();
    return json.success ? (json.staff as StaffSummary[]) : [];
  } catch {
    console.warn('[StaffService] getActiveStaff failed');
    return [];
  }
}

/** Owner: get all staff including inactive (for the management panel) */
export async function getAllStaff(): Promise<StaffSummary[]> {
  try {
    const res = await fetch('/api/staff/all', { cache: 'no-store' });
    const json = await res.json();
    return json.success ? (json.staff as StaffSummary[]) : [];
  } catch {
    console.warn('[StaffService] getAllStaff failed');
    return [];
  }
}

/** Owner: add a new staff member */
export async function addStaffMember(name: string, pin: string): Promise<{ success: boolean; error?: string }> {
  if (!name.trim() || !pin.trim()) return { success: false, error: 'Enter a name and PIN' };
  if (pin.trim().length < 4) return { success: false, error: 'PIN must be at least 4 digits' };

  try {
    return await postJson('/api/staff/add', { name, pin });
  } catch {
    return { success: false, error: 'Something went wrong. Try again.' };
  }
}

/** Owner: toggle a staff member's active status */
export async function toggleStaffActive(id: string, active: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    return await postJson('/api/staff/toggle', { id, active });
  } catch {
    return { success: false, error: 'Something went wrong. Try again.' };
  }
}

/** Owner: permanently remove a staff member */
export async function removeStaffMember(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    return await postJson('/api/staff/remove', { id });
  } catch {
    return { success: false, error: 'Something went wrong. Try again.' };
  }
}

export interface ResetPinResult {
  success: boolean;
  pin?: string;
  error?: string;
}

/** Owner: reset a staff member's PIN to a new random 4-digit value */
export async function resetStaffPin(id: string): Promise<ResetPinResult> {
  try {
    return await postJson<ResetPinResult>('/api/staff/reset-pin', { id });
  } catch {
    return { success: false, error: 'Something went wrong. Try again.' };
  }
}
