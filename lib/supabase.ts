import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

let browserClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error('Falta configurar Supabase');
  }
  if (typeof window === 'undefined') {
    return createClient(url, anonKey);
  }
  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }
  return browserClient;
}

export type RsvpRow = {
  id: string;
  nombre: string;
  tipo: 'GENERAL' | 'DISENO';
  whatsapp: string | null;
  estado: 'abierto' | 'confirmado';
  asistencia: 'yes' | 'no' | null;
  opened_at: string;
  confirmed_at: string | null;
  created_at: string;
};
