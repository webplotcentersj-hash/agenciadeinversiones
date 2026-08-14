'use client';

import { BRAND } from '@/lib/event';

/** Las tres agencias están sobre la misma calle. La tarjeta abre el mapa. */
export default function LocationCard({ visible }: { visible: boolean }) {
  return (
    <a
      id="location-trigger"
      href={BRAND.maps}
      target="_blank"
      rel="noopener noreferrer"
      className={`flow-section reveal-stagger location-link w-full max-w-lg mx-auto mt-2 sm:mt-3 mb-1 sm:mb-3 text-center flex flex-col items-center${
        visible ? ' is-visible' : ''
      }`}
    >
      <div className="location-card w-full">
        <div className="location-pin w-11 h-11 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-4 mx-auto">
          <i className="fa-solid fa-location-dot text-lg sm:text-3xl" />
        </div>
        <p className="location-card__street text-lg sm:text-2xl md:text-3xl tracking-wide leading-snug">
          {BRAND.street}
        </p>
        <span className="location-card__chip mt-2 sm:mt-4 inline-flex items-center gap-2 text-[10px] sm:text-sm tracking-[0.14em] sm:tracking-[0.2em] uppercase font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
          <i className="fa-solid fa-map-location-dot text-[9px] sm:text-[10px]" />
          Tres casas · {BRAND.city}
        </span>
      </div>
    </a>
  );
}
