'use client';

import { useEffect, useRef } from 'react';
import { AGENCIES } from '@/lib/event';
import { prefersReducedMotion } from '@/lib/anime';

/** Las tres agencias del grupo: logo y slogan. */
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
    if (!last) return;

    const markLast = () => {
      if (toldLast.current) return;
      toldLast.current = true;
      onLastVisible?.();
    };

    const reveal = (el: HTMLElement) => {
      el.classList.add('is-in');
      if (el === last) markLast();
    };

    if (prefersReducedMotion()) {
      cards.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      // Las tarjetas ahora son cortas: un umbral alto las deja pegadas al
      // fondo de la pantalla y nunca disparan el cierre.
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );

    cards.forEach((c) => io.observe(c));

    // Red de seguridad: si la última ya está cerca del borde inferior,
    // entra igual y libera el RSVP.
    const ioEnd = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        reveal(last);
        ioEnd.disconnect();
      },
      { threshold: 0, rootMargin: '0px 0px 45% 0px' }
    );
    ioEnd.observe(last);

    return () => {
      io.disconnect();
      ioEnd.disconnect();
    };
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
            className={`agency-card agency-card--${agency.tone}`}
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
          </li>
        ))}
      </ul>
    </div>
  );
}
