'use client';

import { useEffect, useRef } from 'react';
import { BRAND, EVENT } from '@/lib/event';
import { animate, prefersReducedMotion } from '@/lib/anime';

/** Tarjeta de fecha con efecto tilt 3D (mismo cálculo que el original: máx. 15°). */
export default function DateCard({ guestName, visible }: { guestName: string; visible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMove(clientX: number, clientY: number) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -15;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function resetTilt() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
  }

  function killTransition() {
    if (cardRef.current) cardRef.current.style.transition = 'none';
  }

  useEffect(() => {
    if (!visible || !cardRef.current || prefersReducedMotion()) return;
    const anim = animate(cardRef.current, {
      opacity: 1,
      y: { from: 28 },
      rotateX: { from: 8 },
      duration: 780,
      ease: 'outExpo',
    });
    return () => { anim.revert(); };
  }, [visible]);

  return (
    <div
      id="flow-date"
      className={`flow-section reveal-stagger glow-border-wrap w-full max-w-lg mx-auto mt-1 sm:mt-2${
        visible ? ' is-visible' : ''
      }`}
    >
      <div
        ref={cardRef}
        id="tilt-card"
        className="tilt-card glass-panel p-5 sm:p-8 md:p-10 text-center relative overflow-hidden w-full group"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onMouseEnter={killTransition}
        onTouchStart={killTransition}
        onMouseLeave={resetTilt}
        onTouchEnd={resetTilt}
      >
        <span className="corner-ornament corner-ornament--tl" />
        <span className="corner-ornament corner-ornament--tr" />
        <span className="corner-ornament corner-ornament--bl" />
        <span className="corner-ornament corner-ornament--br" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-400/5 via-transparent to-brand-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="tilt-content relative z-10">
          <p className="font-display text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-2 date-card__kicker">
            Te invitamos a la inauguración
          </p>
          <p id="date-guest-name" className="guest-name-line text-lg sm:text-lg mb-2">
            {guestName}
          </p>
          <p className="date-card__when">
            {EVENT.weekday} {EVENT.day} de {EVENT.monthLong}
          </p>
          <p className="date-card__time mt-1.5 font-display text-base tracking-[0.22em] sm:tracking-[0.25em] uppercase font-semibold">
            a las 19 hs
          </p>
          <p className="date-card__venue">
            <span>en {EVENT.venueLine}</span>
            <span>{EVENT.locality} · {BRAND.city}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
