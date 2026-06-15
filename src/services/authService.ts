// ============================================================
// AUTH SERVICE — signup, login, logout, profile management
// Wraps Supabase Auth. Used by components in src/components/Auth
// and src/app/auth/*, src/app/profile/*
// ============================================================
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

const supabase = createClient();

/** SA WhatsApp number validation: 073 123 4567 -> 0[6-8]XXXXXXXX */
export function isValidSAWhatsApp(wa: string): boolean {
  const cleaned = wa.trim().replace(/\s/g, '').replace(/^\+27/, '0');
  return /^0[6-8]\d{8}$/.test(cleaned);
}

/** Normalise 073... or +27... to 27XXXXXXXXX for storage */
export function normaliseWhatsApp(wa: string): string {
  const cleaned = wa.trim().replace(/\s/g, '');
  if (cleaned.startsWith('0')) return '27' + cleaned.slice(1);
  return cleaned.replace('+', '');
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  wa: string; // raw input, e.g. "073 123 4567"
}

export interface SignupResult {
  success: boolean;
  error?: string;
  duplicateEmail?: boolean;
}

/**
 * Sign up a new customer.
 * Profile row is auto-created by the `handle_new_user` DB trigger
 * (see supabase/schema.sql) using the metadata passed here.
 */
export async function signUp(input: SignupInput): Promise<SignupResult> {
  if (!input.name || !input.email || !input.password || !input.wa) {
    return { success: false, error: 'Please fill in all fields.' };
  }
  if (input.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }
  if (!isValidSAWhatsApp(input.wa)) {
    return { success: false, error: 'Please enter a valid SA WhatsApp number (e.g. 073 123 4567).' };
  }

  const wa = normaliseWhatsApp(input.wa);

  const { error } = await supabase.auth.signUp({
    email: input.email.toLowerCase().trim(),
    password: input.password,
    options: {
      data: { name: input.name.trim(), wa },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return { success: false, duplicateEmail: true, error: 'An account with this email already exists.' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function logIn(email: string, password: string): Promise<LoginResult> {
  if (!email || !password) {
    return { success: false, error: 'Please enter your email and password.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error) {
    return { success: false, error: 'Incorrect email or password.' };
  }

  return { success: true };
}

export async function logOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Get the currently logged-in user's profile, or null */
export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (error) return null;
  return data as Profile;
}

export interface UpdateProfileInput {
  name: string;
  wa: string; // raw input
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name || !input.wa) {
    return { success: false, error: 'Name and WhatsApp number are required.' };
  }
  if (!isValidSAWhatsApp(input.wa)) {
    return { success: false, error: 'Please enter a valid SA WhatsApp number.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ name: input.name.trim(), wa: normaliseWhatsApp(input.wa) })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  // Re-authenticate with current password first to verify it
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.email) return { success: false, error: 'Not logged in.' };

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  });
  if (reauthError) return { success: false, error: 'Current password is incorrect.' };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };

  return { success: true };
}

/**
 * Forgot password — sends a Supabase password reset email.
 * Replaces the old "reset to bundu2026" approach with a real flow.
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  if (!email) return { success: false, error: 'Please enter your email address.' };

  const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** Generate initials from a full name: "Tshepo Ogleloo" -> "TO" */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || '?';
}
