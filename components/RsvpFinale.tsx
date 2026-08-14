'use client';

import { useEffect, useRef, useState } from 'react';
import BrandLockup from '@/components/BrandLockup';
import { EVENT } from '@/lib/event';
import { animate, prefersReducedMotion } from '@/lib/anime';
import { fireConfetti } from '@/lib/confetti';
import { confirmRsvp, readGuestId } from '@/lib/rsvp';

const RSVP_KEY = 'inviteRsvpConfirmed';

const CHART_BOTTOM: [number, number][] = [
  [0, 348],
  [85, 322],
  [165, 286],
  [245, 305],
  [330, 238],
  [415, 255],
  [500, 188],
  [585, 168],
  [670, 124],
  [755, 142],
  [845, 78],
  [1000, 46],
];

const CHART_TOP: [number, number][] = [
  [0, 58],
  [90, 82],
  [170, 64],
  [255, 118],
  [340, 98],
  [425, 152],
  [510, 138],
  [600, 192],
  [685, 176],
  [775, 228],
  [860, 248],
  [1000, 292],
];

const VOLUMES = [22, 36, 28, 44, 31, 52, 38, 48, 29, 41, 34, 46];

function linePath(points: [number, number][]) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
}

function areaPath(points: [number, number][], closeY: number) {
  return `${linePath(points)} L1000 ${closeY} L0 ${closeY} Z`;
}

function ChartGraphic({
  points,
  id,
  closeY,
  volumes,
}: {
  points: [number, number][];
  id: string;
  closeY: number;
  volumes?: number[];
}) {
  const gridY = [70, 140, 210, 280, 350];
  const gridX = [0, 125, 250, 375, 500, 625, 750, 875, 1000];
  const fillUp = closeY === 0;

  return (
    <svg className={`rsvp-finale__chart rsvp-finale__chart--${fillUp ? 'top' : 'bottom'}`} viewBox="0 0 1000 420" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          {fillUp ? (
            <>
              <stop offset="0%" stopColor="rgba(255,154,147,0)" />
              <stop offset="100%" stopColor="rgba(255,154,147,0.2)" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="rgba(255,154,147,0.28)" />
              <stop offset="100%" stopColor="rgba(255,154,147,0)" />
            </>
          )}
        </linearGradient>
      </defs>
      {gridY.map((y) => (
        <line key={`h${y}`} className="rsvp-grid rsvp-grid--h" x1="0" y1={y} x2="1000" y2={y} />
      ))}
      {gridX.map((x) => (
        <line key={`v${x}`} className="rsvp-grid rsvp-grid--v" x1={x} y1="20" x2={x} y2="400" />
      ))}
      {volumes?.map((h, i) => {
        const x = i * (1000 / volumes.length);
        const w = 1000 / volumes.length - 10;
        const y = fillUp ? 8 : 420 - h * 1.6;
        return (
          <rect
            key={i}
            className="rsvp-vol"
            x={x + 5}
            y={y}
            width={w}
            height={h * 1.6}
          />
        );
      })}
      <path className="rsvp-finale__area" d={areaPath(points, closeY)} fill={`url(#${id}-area)`} />
      <path className="rsvp-finale__line" d={linePath(points)} />
      {points.map(([x, y], i) => (
        <circle
          key={i}
          className="rsvp-dot"
          cx={x}
          cy={y}
          r={i === points.length - 1 ? 7 : 4.5}
          style={{ '--d': `${0.55 + i * 0.08}s` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

function alreadyConfirmed(): boolean {
  try {
    return sessionStorage.getItem(RSVP_KEY) === '1';
  } catch {
    return false;
  }
}

function firstName(full: string): string {
  const part = full.trim().split(/\s+/)[0];
  return part || '';
}

/** Cierre: aparece recién después de la última agencia. */
export default function RsvpFinale({ guestName }: { guestName: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [thanks, setThanks] = useState(alreadyConfirmed);

  useEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root) return;

    const reduced = prefersReducedMotion();
    const show = () => {
      root.classList.add('is-in');
      if (reduced) {
        root.scrollIntoView({ block: 'start' });
        return;
      }
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const start = window.setTimeout(show, 60);

    if (card && !reduced) {
      const anim = animate(card, {
        opacity: 1,
        y: { from: 36 },
        scale: { from: 0.97 },
        duration: 900,
        ease: 'outExpo',
        delay: 280,
      });
      return () => {
        window.clearTimeout(start);
        anim.revert();
      };
    }

    return () => window.clearTimeout(start);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const digits = whatsapp.replace(/\D/g, '');
    if (digits.length < 8) {
      setError('Ingresá un WhatsApp válido');
      return;
    }

    const id = readGuestId();
    if (!id) {
      setError('Recargá la invitación e ingresá tu nombre primero');
      return;
    }

    setError('');
    setBusy(true);
    try {
      await confirmRsvp(id, whatsapp);
      try {
        sessionStorage.setItem(RSVP_KEY, '1');
        sessionStorage.setItem('inviteRsvpWhatsapp', digits);
      } catch {
        /* sessionStorage puede fallar en modo privado */
      }
      const rect = cardRef.current?.getBoundingClientRect();
      fireConfetti(
        rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        rect ? rect.top + 40 : window.innerHeight * 0.55,
        90
      );
      setThanks(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo confirmar');
    } finally {
      setBusy(false);
    }
  }

  const name = firstName(guestName);

  return (
    <section
      ref={rootRef}
      id="rsvp-finale"
      className={`rsvp-finale${thanks ? ' is-thanks' : ''}`}
      aria-labelledby="rsvp-title"
    >
      <div className="rsvp-finale__bg" aria-hidden="true">
        <div className="rsvp-finale__wash" />
        <ChartGraphic points={CHART_TOP} id="rsvp-top" closeY={0} />
        <ChartGraphic points={CHART_BOTTOM} id="rsvp-bot" closeY={420} volumes={VOLUMES} />
      </div>

      <div className="rsvp-finale__card" ref={cardRef}>
        {thanks ? (
          <div className="rsvp-thanks">
            <p className="rsvp-thanks__kicker">Confirmado</p>
            <h2 id="rsvp-title" className="rsvp-thanks__title">
              Gracias{name ? `, ${name}` : ''}
            </h2>
            <p className="rsvp-thanks__msg">Te esperamos este viernes {EVENT.day}</p>
            <div className="rsvp-finale__logo-halo">
              <span className="rsvp-finale__logo-spin" aria-hidden="true" />
              <BrandLockup className="rsvp-finale__logo" />
            </div>
          </div>
        ) : (
          <>
            <div className="rsvp-finale__logo-halo">
              <BrandLockup className="rsvp-finale__logo" />
            </div>
            <p className="rsvp-finale__kicker">Confirmación</p>
            <h2 id="rsvp-title" className="rsvp-finale__title">
              ¿Venís el viernes {EVENT.day}?
            </h2>
            <p className="rsvp-finale__sub">Dejanos tu WhatsApp y confirmá que vas</p>
            <form onSubmit={handleSubmit} className="rsvp-form">
              <label className="sr-only" htmlFor="rsvp-whatsapp">
                WhatsApp
              </label>
              <div className="relative">
                <i className="fa-brands fa-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-white text-lg" />
                <input
                  id="rsvp-whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="WhatsApp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full input-glass rounded-xl pl-12 pr-4 py-3.5 text-base"
                />
              </div>
              {error ? (
                <p className="rsvp-form__error" aria-live="polite">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="group w-full btn-interactive rounded-xl px-4 py-3.5 font-bold tracking-[0.12em] uppercase text-sm flex justify-center items-center gap-2 disabled:pointer-events-none"
              >
                {busy ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin" />
                    <span>Confirmando...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar asistencia</span>
                    <i className="fa-solid fa-check" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
