'use client';

import { useEffect, useRef } from 'react';
import { animate, prefersReducedMotion } from '@/lib/anime';

/** Formas geométricas en loop, movidas con anime.js. */
export default function MotionField({ variant = 'page' }: { variant?: 'page' | 'gate' | 'intro' }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const rings = root.querySelectorAll('.motion-ring');
    const dots = root.querySelectorAll('.motion-dot');
    const bars = root.querySelectorAll('.motion-bar');
    const extras = root.querySelectorAll('.motion-plus, .motion-sq');

    const a1 = animate(rings, {
      rotate: 360,
      duration: 18000,
      ease: 'linear',
      loop: true,
    });
    const a2 = animate(dots, {
      y: { from: 0, to: -12 },
      duration: 2400,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });
    const a3 = animate(bars, {
      x: { from: -8, to: 10 },
      opacity: { from: 0.35, to: 1 },
      duration: 3200,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });
    const a4 = animate(extras, {
      rotate: { from: 0, to: 50 },
      y: { from: 0, to: -8 },
      duration: 3600,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    return () => {
      a1.revert();
      a2.revert();
      a3.revert();
      a4.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={`motion-field motion-field--${variant}`} aria-hidden="true">
      <span className="motion-ring motion-ring--a" />
      <span className="motion-ring motion-ring--b" />
      <span className="motion-dot motion-dot--a" />
      <span className="motion-dot motion-dot--b" />
      <span className="motion-dot motion-dot--c" />
      <span className="motion-bar motion-bar--a" />
      <span className="motion-bar motion-bar--b" />
      <span className="motion-plus" />
      <span className="motion-sq" />
    </div>
  );
}
