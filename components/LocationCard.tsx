'use client';

import { AGENCIES, BRAND, EVENT, mapsEmbedUrl, mapsUrl } from '@/lib/event';

const AUTO = AGENCIES.find((agency) => agency.id === 'automotores') ?? AGENCIES[1];
const VENUE = AUTO.mapsQuery;

/** Primero se aclara qué se inaugura; el mapa y la leyenda ubican el local. */
export default function LocationCard({ visible }: { visible: boolean }) {
  return (
    <div
      id="location-trigger"
      className={`flow-section reveal-stagger location-block w-full max-w-lg mx-auto mt-2 sm:mt-3 mb-1 sm:mb-3${
        visible ? ' is-visible' : ''
      }`}
    >
      <p className="location-inaugura">
        <span className="location-inaugura__kicker">Inauguramos</span>
        <img
          src={AUTO.logo.src}
          width={AUTO.logo.width}
          height={AUTO.logo.height}
          alt={AUTO.name}
          className="location-inaugura__logo"
        />
      </p>

      <div className="location-map">
        <iframe
          className="location-map__frame"
          title={`Mapa de ${AUTO.name}, ${EVENT.landmark}`}
          src={mapsEmbedUrl(VENUE)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
        />
        <span className="location-map__wash" aria-hidden="true" />
        <span className="location-map__pin" aria-hidden="true">
          <i className="fa-solid fa-car" />
        </span>
        <span className="location-map__badge">
          <strong>Agencia de Automotores</strong>
          {EVENT.landmark}
        </span>
        <a
          className="location-map__hit"
          href={BRAND.maps}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir el mapa de {AUTO.name}, {EVENT.landmark}
        </a>
      </div>

      <p className="location-legend">
        <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
        <span>
          <strong>{EVENT.landmark}</strong>
          {AUTO.address}
        </span>
      </p>

      <a
        href={mapsUrl(VENUE)}
        target="_blank"
        rel="noopener noreferrer"
        className="location-link text-center flex flex-col items-center"
      >
        <div className="location-card location-card--meta w-full">
          <p className="location-card__street text-base sm:text-xl tracking-wide leading-snug">
            {BRAND.street}
          </p>
          <span className="location-card__chip mt-2 inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.18em] uppercase font-semibold px-3 py-1.5 rounded-full">
            <i className="fa-solid fa-map-location-dot text-[9px]" />
            Tres casas · {BRAND.city}
          </span>
        </div>
      </a>
    </div>
  );
}
