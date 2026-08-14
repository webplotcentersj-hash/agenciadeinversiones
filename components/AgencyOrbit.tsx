'use client';

import { useEffect, useRef } from 'react';
import { AGENCIES } from '@/lib/event';
import { animate, prefersReducedMotion } from '@/lib/anime';

/** Tres íconos que orbitan alrededor de un centro (sello o cinta). */
export default function AgencyOrbit() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const anim = animate(root, {
      rotate: 360,
      duration: 14000,
      ease: 'linear',
      loop: true,
    });
    return () => { anim.revert(); };
  }, []);

  return (
    <div ref={rootRef} className="agency-orbit" aria-hidden="true">
      {AGENCIES.map((agency, i) => (
        <span
          key={agency.id}
          className={`agency-orbit__item agency-orbit__item--${agency.tone}`}
          style={{ '--a': `${i * 120}deg` } as React.CSSProperties}
        >
          <i className={`fa-solid ${agency.icon}`} />
        </span>
      ))}
    </div>
  );
}
