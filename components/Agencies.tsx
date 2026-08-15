'use client';

import { useEffect, useRef } from 'react';
import { AGENCIES, mapsUrl } from '@/lib/event';
import { prefersReducedMotion } from '@/lib/anime';

/** Las tres agencias del grupo, con servicios y dirección de cada una. */
export default function Agencies({
  visible,
  onLastVisible,
}: {
  visible: boolean;
  /** La última tarjeta ya está en pantalla: recién ahí puede entrar el cierre. */
  onLastVisible?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const toldLast = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    // Se observa recién cuando la sección se revela: antes las tarjetas están
    // en un contenedor con opacity 0 pero ocupando lugar, así que el observer
    // las daría por vistas y entrarían las tres juntas.
    if (!visible || !root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.agency-card'));
    const last = cards[cards.length - 1];

    const markLast = () => {
      if (toldLast.current) return;
      toldLast.current = true;
      onLastVisible?.();
    };

    if (prefersReducedMotion()) {
      cards.forEach((c) => c.classList.add('is-in'));
      markLast();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target); // una sola vez: no reaparece al subir
          if (entry.target === last) markLast();
        }
      },
      // Pide que la tarjeta esté bien entrada en pantalla: así se revela una
      // por vez en lugar de dispararse todas apenas asoma el borde.
      { threshold: 0.45, rootMargin: '0px 0px -18% 0px' }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [visible, onLastVisible]);

  return (
    <div
      ref={rootRef}
      id="agencies-section"
      className={`flow-section reveal-stagger w-full max-w-lg mx-auto mt-6 sm:mt-8${
        visible ? ' is-visible' : ''
      }`}
    >
      <h3 className="agencies-heading flex items-center justify-center gap-2 sm:gap-3">
        <span className="divider-line flex-1 max-w-10 sm:max-w-16" />
        El grupo
        <span className="divider-line flex-1 max-w-10 sm:max-w-16" />
      </h3>

      <ul className="agencies-list">
        {AGENCIES.map((agency, i) => (
          <li
            key={agency.id}
            className={`agency-card agency-card--${agency.tone}${
              agency.id === 'automotores' ? ' agency-card--inaugura' : ''
            }`}
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className="agency-card__index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="agency-card__bar" aria-hidden="true" />
            <h4 className="agency-card__name">
              <img
                src={agency.logo.src}
                width={agency.logo.width}
                height={agency.logo.height}
                alt={agency.name}
                className="agency-card__logo"
                loading="lazy"
                decoding="async"
              />
            </h4>
            <p className="agency-card__tagline">{agency.tagline}</p>
            {agency.id === 'automotores' && (
              <>
                <span className="agency-card__inaugura">Inauguramos</span>
                <a
                  className="agency-card__address"
                  href={mapsUrl(agency.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  <span>{agency.address}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
