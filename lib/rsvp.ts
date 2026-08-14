import { getSupabase } from '@/lib/supabase';
import type { InviteTipo } from '@/lib/event';

type OpenResult = {
  ok: boolean;
  id: string;
  nombre: string;
  tipo: InviteTipo;
  estado: 'abierto';
};

type ConfirmResult = {
  ok: boolean;
  id: string;
  asistencia: 'yes';
  estado: 'confirmado';
  already?: boolean;
};

function rpcError(error: { message?: string } | null, fallback: string): never {
  throw new Error(error?.message || fallback);
}

/** Registra que el invitado abrió la invitación. Devuelve el id para confirmar después. */
export async function openRsvp(nombre: string, tipo: InviteTipo): Promise<OpenResult> {
  const { data, error } = await getSupabase().rpc('rsvp_open', {
    p_nombre: nombre,
    p_tipo: tipo,
  });
  if (error || !data?.ok) rpcError(error, 'No se pudo registrar la apertura');
  return data as OpenResult;
}

/** Confirma asistencia y guarda el WhatsApp. */
export async function confirmRsvp(id: string, whatsapp: string): Promise<ConfirmResult> {
  const { data, error } = await getSupabase().rpc('rsvp_confirm', {
    p_id: id,
    p_whatsapp: whatsapp,
  });
  if (error || !data?.ok) rpcError(error, 'No se pudo guardar la confirmación');
  return data as ConfirmResult;
}

export function readGuestId(): string {
  try {
    return sessionStorage.getItem('inviteGuestId') || '';
  } catch {
    return '';
  }
}

export function writeGuestId(id: string) {
  try {
    sessionStorage.setItem('inviteGuestId', id);
  } catch {
    /* sessionStorage puede fallar en modo privado */
  }
}
