'use client';

import { useEffect, useRef } from 'react';
import BrandLockup from '@/components/BrandLockup';
import Envelope from '@/components/Envelope';
import MotionField from '@/components/MotionField';
import { createTimeline, prefersReducedMotion, target } from '@/lib/anime';
import { BRAND, EVENT, HEADLINE } from '@/lib/event';
import type { EventStatus } from '@/lib/useEventStatus';

type Props = {
  tone: string;
  guestName: string;
  isOpen: boolean;
  play: boolean;
  status: EventStatus | null;
  onRequestOpen: () => void;
  onOpened: () => void;
};

/** El titular es la inauguración; sólo cambia si el evento es hoy. */
function titular(status: EventStatus | null) {
  switch (status) {
    case 'inminente':
    case 'hoy':
      return 'Es hoy';
    default:
      return HEADLINE.main;
  }
}

/** Portada: marca, titular y el sobre que abre la invitación. */
export default function Hero({ tone, guestName, isOpen, play, status, onRequestOpen, onOpened }: Props) {
  const esHoy = status === 'hoy' || status === 'inminente' || status === 'encurso';
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!play || !heroRef.current || prefersReducedMotion()) return;
    const root = heroRef.current;
    const tl = createTimeline({ defaults: { ease: 'outExpo' } });
    tl.add(target(root, '.brand-lockup--hero'), { opacity: 1, y: { from: 18 }, duration: 620 }, 0)
      .add(target(root, '.hero-ghost'), { opacity: 1, scale: { from: 0.86 }, duration: 900 }, 0)
      .add(
        target(root, '.hero-badge'),
        { opacity: 1, scale: { from: 0.7 }, duration: 620, ease: 'outBack' },
        120
      )
      .add(target(root, '.hero-title-1'), { opacity: 1, y: { from: 34 }, duration: 760 }, 240)
      .add(target(root, '#hero-tone'), { opacity: 1, y: { from: 12 }, duration: 560 }, 440)
      .add(target(root, '.envelope-stage'), { opacity: 1, y: { from: 46 }, duration: 900 }, 520);
    return () => {
      tl.revert();
    };
  }, [play]);

  return (
    <header
      ref={heroRef}
      id="hero-section"
      className="relative z-20 flex flex-col items-center justify-center pt-3 sm:pt-6 pb-1 sm:pb-3 min-h-0 flex-1 overflow-x-clip overflow-y-visible"
    >
      <div className="hero-spotlight" aria-hidden="true" />
      <p className="hero-ghost" aria-hidden="true">
        {EVENT.day}
      </p>
      <MotionField variant="page" />

      <div className="text-center px-3 sm:px-4 w-full max-w-4xl mx-auto relative z-10">
        <BrandLockup className="brand-lockup--hero mx-auto mb-4 sm:mb-5" priority />
        {esHoy && (
          <p className="hero-today" aria-live="polite">
            <span className="hero-today__dot" aria-hidden="true" />
            {status === 'encurso' ? 'Está pasando' : 'Te esperamos hoy'}
          </p>
        )}
        {/* El aniversario acompaña al titular, no compite con él. El rango de
            años no se repite acá: ya lo lleva la franja de arriba y abajo. */}
        <p className="hero-badge" aria-label={`${BRAND.yearsLabel} de ${BRAND.group}`}>
          <span className="hero-badge__num" aria-hidden="true">{BRAND.years}</span>
          <span className="hero-badge__text" aria-hidden="true">años</span>
        </p>
        <h1 className="hero-title-1 font-display font-black uppercase tracking-tight leading-none mb-2 sm:mb-3">
          {titular(status)}
        </h1>
        <p id="hero-tone" className="max-w-md mx-auto mb-4 leading-relaxed px-2">
          {tone}
        </p>
      </div>

      <Envelope guestName={guestName} isOpen={isOpen} onRequestOpen={onRequestOpen} onFinished={onOpened} />
    </header>
  );
}
