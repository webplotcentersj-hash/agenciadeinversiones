'use client';

import { useEffect, useState } from 'react';
import { EVENT_TIMESTAMP } from './event';

/**
 * En qué momento del evento estamos.
 * - `lejos`     falta más de un día
 * - `hoy`       es el día, todavía no empezó
 * - `inminente` falta menos de una hora
 * - `encurso`   ya arrancó
 * - `terminado` pasó
 */
export type EventStatus = 'lejos' | 'hoy' | 'inminente' | 'encurso' | 'terminado';

const HORA = 60 * 60 * 1000;
/** El evento arranca 19:00, así que el día empieza 19 h antes. Evita malabares de zona horaria. */
const INICIO_DEL_DIA = 19 * HORA;
/** El line up cierra 23:00; una hora de gracia después. */
const FIN = 5 * HORA;

export function statusAt(now: number): EventStatus {
  const falta = EVENT_TIMESTAMP - now;
  if (now > EVENT_TIMESTAMP + FIN) return 'terminado';
  if (falta <= 0) return 'encurso';
  if (falta <= HORA) return 'inminente';
  if (falta <= INICIO_DEL_DIA) return 'hoy';
  return 'lejos';
}

/**
 * Arranca en `null` y se resuelve en el cliente: el servidor no puede saber
 * qué hora es para el invitado sin romper la hidratación.
 */
export function useEventStatus(): EventStatus | null {
  const [status, setStatus] = useState<EventStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(statusAt(Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
