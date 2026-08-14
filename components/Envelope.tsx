'use client';

import { useEffect, useRef, useState } from 'react';
import { BRAND, EVENT, EVENT_HAS_DATE, HEADLINE } from '@/lib/event';
import { celebrateCut } from '@/lib/confetti';
import { createTimeline, prefersReducedMotion, target } from '@/lib/anime';
import BrandLockup from '@/components/BrandLockup';

type Props = {
  guestName: string;
  /** true cuando ya se tocó el sobre: dispara la apertura. */
  isOpen: boolean;
  /** El invitado tocó el sobre. */
  onRequestOpen: () => void;
  /** La carta terminó de salir: ya se puede mostrar el contenido. */
  onFinished: () => void;
};

/**
 * El sobre de la invitación. Cerrado muestra el lacre; al tocarlo la solapa
 * se abre hacia atrás y la carta sube. Cuando la carta terminó de salir se
 * avisa hacia arriba para que se revele el contenido.
 */
export default function Envelope({ guestName, isOpen, onRequestOpen, onFinished }: Props) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const [flapBack, setFlapBack] = useState(false);

  useEffect(() => {
    if (!isOpen || !rootRef.current) return;
    const root = rootRef.current;

    // La solapa pasa por detrás del sobre apenas cruza la vertical; si no,
    // tapa la carta cuando sube.
    const zSwap = setTimeout(() => setFlapBack(true), 380);

    if (prefersReducedMotion()) {
      const done = setTimeout(onFinished, 150);
      return () => {
        clearTimeout(zSwap);
        clearTimeout(done);
      };
    }

    const tl = createTimeline({ defaults: { ease: 'outExpo' } });

    tl.add(target(root, '.envelope__seal'), { opacity: 0, scale: 0.4, duration: 320, ease: 'inQuad' }, 0)
      .add(target(root, '.envelope__flap'), { rotateX: -180, duration: 900, ease: 'inOutQuart' }, 80)
      .add(target(root, '.envelope__letter'), { y: '-70%', scale: 1.03, duration: 1000 }, 620)
      .add(target(root, '.envelope__letter-inner'), { opacity: 1, y: { from: 14 }, duration: 620 }, 900)
      .add(
        root,
        {
          scale: 1.06,
          opacity: 0,
          duration: 700,
          ease: 'inCubic',
          onBegin: () => {
            const r = root.getBoundingClientRect();
            celebrateCut(r.left + r.width / 2, r.top + r.height / 2);
          },
          onComplete: onFinished,
        },
        1750
      );

    return () => {
      clearTimeout(zSwap);
      tl.revert();
    };
  }, [isOpen, onFinished]);

  function handleClick() {
    if (isOpen) return;
    if (navigator.vibrate) navigator.vibrate(24);
    onRequestOpen();
  }

  const cls = ['envelope', isOpen && 'is-open', flapBack && 'is-flap-back'].filter(Boolean).join(' ');

  return (
    <div className="envelope-stage">
      <button type="button" ref={rootRef} className={cls} onClick={handleClick} disabled={isOpen} aria-label="Abrir la invitación">
        <span className="envelope__back" aria-hidden="true" />

        <span className="envelope__letter" aria-hidden="true">
          <span className="envelope__letter-inner">
            <BrandLockup className="envelope__letter-logo" variant="solido" />
            <span className="envelope__letter-title">{HEADLINE.main}</span>
            {EVENT_HAS_DATE && (
              <span className="envelope__letter-date">
                {EVENT.day} · {EVENT.month.toUpperCase()} · {EVENT.year}
              </span>
            )}
          </span>
        </span>

        <span className="envelope__front" aria-hidden="true" />
        <span className="envelope__flap" aria-hidden="true" />

        <span className="envelope__seal" aria-hidden="true">
          <span className="envelope__seal-num">{EVENT_HAS_DATE ? EVENT.day : BRAND.years}</span>
        </span>
      </button>

      {!isOpen && (
        <p className="envelope__hint">
          {guestName ? `${guestName}, tocá para abrir` : 'Tocá para abrir'}
        </p>
      )}
    </div>
  );
}
