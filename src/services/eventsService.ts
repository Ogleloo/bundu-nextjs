// ============================================================
// EVENTS SERVICE — fetch events for the public events page
// Events are added via Supabase Table Editor by GTS Captures Studios
// ============================================================
import { createClient } from '@/lib/supabase/client';

export interface BunduEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  poster_url: string | null;
  active: boolean;
  created_at: string;
}

/** Get all active upcoming events, most recent first */
export async function getEvents(): Promise<BunduEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('active', true)
    .order('event_date', { ascending: true });

  if (error) {
    console.warn('[EventsService] getEvents failed:', error);
    return [];
  }
  return data as BunduEvent[];
}

/** Get all customer WhatsApp numbers for event notifications */
export async function getAllCustomerWhatsApps(): Promise<{ name: string; wa: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('name, wa')
    .not('wa', 'is', null);

  if (error) {
    console.warn('[EventsService] getAllCustomerWhatsApps failed:', error);
    return [];
  }
  return data as { name: string; wa: string }[];
}
