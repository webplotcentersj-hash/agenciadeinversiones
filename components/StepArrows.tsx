'use client';

const TOTAL = 6;

/** Pasos que faltan después de la pantalla actual. El nombre arranca en 5 de 6. */
export function remainingSteps(
  phase: 'gate' | 'envelope' | 'stamp' | 'open',
  rsvpReady: boolean,
  rsvpConfirmed: boolean
): number {
  if (rsvpConfirmed) return 0;
  if (rsvpReady) return 1;
  if (phase === 'open') return 2;
  if (phase === 'stamp') return 3;
  if (phase === 'envelope') return 4;
  return 5;
}

/** Flechas neón arriba: cuántos pasos faltan, de 6. */
export default function StepArrows({ remaining }: { remaining: number }) {
  if (remaining <= 0) return null;

  return (
    <div
      className="step-arrows"
      aria-live="polite"
      aria-label={`${remaining} de ${TOTAL}`}
    >
      <div className="step-arrows__row" aria-hidden="true">
        {Array.from({ length: TOTAL }, (_, i) => (
          <i
            key={i}
            className={`fa-solid fa-angles-down step-arrows__item${
              i < remaining ? ' is-on' : ''
            }`}
          />
        ))}
      </div>
      <span className="step-arrows__count">
        {remaining} de {TOTAL}
      </span>
    </div>
  );
}
