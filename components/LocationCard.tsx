'use client';

import { AGENCIES, BRAND, EVENT, mapsEmbedUrl } from '@/lib/event';

const AUTO = AGENCIES.find((agency) => agency.id === 'automotores') ?? AGENCIES[1];
const VENUE = AUTO.mapsQuery;

/** Primero se aclara qué se inaugura; el mapa ubica el local. */
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

      <p className="location-decade">
        <span className="location-decade__kicker">Celebramos</span>
        <span className="location-decade__seal" aria-hidden="true">
          <span className="location-decade__ring" />
          <strong>{BRAND.years}</strong>
          <em>años</em>
        </span>
        <span className="location-decade__title">nuestro décimo aniversario</span>
        <span className="location-decade__range">
          <i />
          {BRAND.since} — {EVENT.year}
          <i />
        </span>
      </p>
    </div>
  );
}
