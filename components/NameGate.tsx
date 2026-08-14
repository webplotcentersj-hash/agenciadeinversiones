'use client';

import { useEffect, useRef, useState } from 'react';
import BrandLockup from '@/components/BrandLockup';
import MotionField from '@/components/MotionField';
import { animate, prefersReducedMotion } from '@/lib/anime';

/**
 * Puerta de entrada: el invitado escribe su nombre para abrir la invitación.
 */
export default function NameGate({
  done,
  onOpen,
}: {
  done: boolean;
  onOpen: (nombre: string) => void | Promise<void>;
}) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;
    const anim = animate(card, {
      opacity: 1,
      y: { from: 56 },
      scale: { from: 0.94 },
      duration: 820,
      ease: 'outExpo',
    });
    return () => { anim.revert(); };
  }, []);

  useEffect(() => {
    if (!done) return;
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || prefersReducedMotion()) return;
    animate(card ?? root, { y: -28, scale: 1.04, opacity: 0, duration: 520, ease: 'inCubic' });
    animate(root, { opacity: 0, duration: 640, ease: 'inQuad' });
  }, [done]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get('nombre');
    const nombre = String(input ?? '').trim();

    if (nombre.length < 2) {
      setError('Ingresá tu nombre y apellido');
      return;
    }

    setError('');
    setBusy(true);
    try {
      sessionStorage.setItem('inviteGuestName', nombre);
    } catch {
      /* sessionStorage puede fallar en modo privado: no es crítico */
    }
    try {
      await onOpen(nombre);
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : 'No se pudo abrir la invitación');
    }
  }

  return (
    <div
      id="name-gate"
      className={`name-gate${done ? ' is-done' : ''}`}
      role="dialog"
      aria-labelledby="name-gate-title"
      aria-modal="true"
      ref={rootRef}
    >
      <div className="name-gate__mesh" aria-hidden="true" />
      <div className="name-gate__grid" aria-hidden="true" />
      <div className="name-gate__blob name-gate__blob--a" aria-hidden="true" />
      <div className="name-gate__blob name-gate__blob--b" aria-hidden="true" />
      <MotionField variant="gate" />
      <div className="name-gate__card" ref={cardRef}>
        <BrandLockup className="name-gate__logo" priority />
        <h2 id="name-gate-title" className="name-gate__title">
          Tu invitación
        </h2>
        <p className="name-gate__subtitle">Ingresá tu nombre para abrirla</p>
        <p className="name-gate__error" aria-live="polite">
          {error}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="relative">
            <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-white" />
            <input
              type="text"
              id="gate-nombre"
              name="nombre"
              required
              autoComplete="name"
              placeholder="Nombre y Apellido"
              className="w-full input-glass rounded-xl pl-12 pr-4 py-3.5 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="group w-full btn-interactive rounded-xl px-4 py-3.5 font-bold tracking-[0.12em] uppercase text-sm flex justify-center items-center gap-2 disabled:pointer-events-none"
          >
            {busy ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" />
                <span>Abriendo...</span>
              </>
            ) : (
              <>
                <span>Abrir invitación</span>
                <i className="fa-solid fa-envelope-open-text" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
