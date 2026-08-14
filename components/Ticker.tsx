'use client';

import { useEffect, useRef } from 'react';
import { animate, prefersReducedMotion } from '@/lib/anime';

const ITEMS = [
  'Grupo Agencias',
  '10 años',
  'Inversiones',
  'Automotores',
  'San Juan',
  '21 de agosto',
];

export default function Ticker({ compact = false }: { compact?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const row = [...ITEMS, ...ITEMS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;
    const anim = animate(track, {
      x: '-50%',
      duration: 22000,
      ease: 'linear',
      loop: true,
    });
    return () => { anim.revert(); };
  }, []);

  return (
    <div className={`ticker${compact ? ' ticker--compact' : ''}`} aria-hidden="true">
      <div className="ticker__track" ref={trackRef}>
        {row.map((item, i) => (
          <span key={`${item}-${i}`}>
            {item}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}
