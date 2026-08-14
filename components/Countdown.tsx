'use client';

import { useEffect, useState } from 'react';
import { EVENT_TIMESTAMP } from '@/lib/event';
import type { EventStatus } from '@/lib/useEventStatus';

function split(distance: number) {
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

type Props = { visible: boolean; status: EventStatus | null };

export default function Countdown({ visible, status }: Props) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Se calcula en el cliente para evitar desajustes de hidratación.
    const tick = () => {
      const distance = EVENT_TIMESTAMP - Date.now();
      setLeft(distance > 0 ? split(distance) : { days: 0, hours: 0, minutes: 0 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const empezo = status === 'encurso' || status === 'terminado';

  // Una vez que arrancó, un contador en cero no dice nada: se cambia por el estado real.
  if (empezo) {
    return (
      <div
        id="flow-countdown"
        className={`flow-section reveal-stagger w-full flex flex-col items-center mt-1${visible ? ' is-visible' : ''}`}
      >
        <div className="event-live">
          <span className="event-live__dot" aria-hidden="true" />
          <span className="event-live__text">
            {status === 'encurso' ? 'La celebración ya empezó' : 'Gracias por venir'}
          </span>
        </div>
      </div>
    );
  }

  const inminente = status === 'inminente';

  return (
    <div
      id="flow-countdown"
      className={`flow-section reveal-stagger w-full flex flex-col items-center mt-1${visible ? ' is-visible' : ''}${
        inminente ? ' is-imminent' : ''
      }`}
    >
      <h3 className="flex items-center justify-center gap-2 sm:gap-3">
        <span className="divider-line flex-1 max-w-10 sm:max-w-16" />
        {inminente ? 'Falta muy poco' : 'Tiempo restante'}
        <span className="divider-line flex-1 max-w-10 sm:max-w-16" />
      </h3>
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 max-w-lg mx-auto">
        <div className="countdown-box rounded-xl sm:rounded-2xl text-center flex-1 min-w-0">
          <span id="days" className="countdown-num font-display font-black mb-0.5 sm:mb-1.5">
            {pad(left.days)}
          </span>
          <span className="countdown-label">Días</span>
        </div>
        <span className="countdown-colon hidden sm:flex">:</span>
        <div className="countdown-box rounded-xl sm:rounded-2xl text-center flex-1 min-w-0">
          <span id="hours" className="countdown-num font-display font-black mb-0.5 sm:mb-1.5">
            {pad(left.hours)}
          </span>
          <span className="countdown-label">Hrs</span>
        </div>
        <span className="countdown-colon hidden sm:flex">:</span>
        <div className="countdown-box countdown-box--pulse rounded-xl sm:rounded-2xl text-center flex-1 min-w-0">
          <span id="minutes" className="countdown-num font-display font-black mb-0.5 sm:mb-1.5">
            {pad(left.minutes)}
          </span>
          <span className="countdown-label">Min</span>
        </div>
      </div>
    </div>
  );
}
