'use client';

import { useEffect, useRef, useState } from 'react';
import { fireConfetti } from '@/lib/confetti';
import { createDrawable, createTimeline, prefersReducedMotion, stagger, target } from '@/lib/anime';
import AgencyOrbit from '@/components/AgencyOrbit';
import BrandLockup from '@/components/BrandLockup';
import MotionField from '@/components/MotionField';
import Ticker from '@/components/Ticker';
import { BRAND, EVENT, HEADLINE } from '@/lib/event';

type Props = {
  play: boolean;
  eyebrow: string;
  onRevealed: () => void;
  onFinished: () => void;
};

/** Entrada con timeline de anime.js: sello, trazo SVG y órbita. */
export default function IntroCurtain({ play, eyebrow, onRevealed, onFinished }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!play || !rootRef.current) return;
    const root = rootRef.current;

    if (prefersReducedMotion()) {
      onRevealed();
      onFinished();
      return;
    }

    const stamp = target(root, '.intro-reveal__stamp');
    const num = target(root, '.intro-reveal__stamp-num');
    const label = target(root, '.intro-reveal__stamp-label');
    const logoEl = target(root, '.intro-reveal__logo');
    const eyebrowEl = target(root, '.intro-reveal__eyebrow');
    const dateEl = target(root, '.intro-reveal__date');
    const orbitItems = root.querySelectorAll('.agency-orbit__item');
    const circle = root.querySelector<SVGGeometryElement>('.intro-reveal__draw circle');
    const drawable = circle ? createDrawable(circle) : [];

    const tl = createTimeline({ defaults: { ease: 'outExpo' } });

    tl.add(logoEl, { opacity: 1, y: { from: 22 }, duration: 620 }, 0)
      .add(eyebrowEl, { opacity: 1, y: { from: 18 }, duration: 520 }, 180)
      .add(
        stamp,
        { opacity: 1, scale: { from: 0.35 }, rotate: { from: -14 }, duration: 920, ease: 'outBack' },
        80
      )
      .add(num, { scale: { from: 0.2 }, duration: 700, ease: 'outExpo' }, '-=620')
      .add(label, { opacity: 1, y: { from: 8 }, duration: 420 }, '-=480');

    if (drawable.length) {
      tl.add(drawable, { draw: ['0 0', '0 1'], duration: 1100, ease: 'inOutQuad' }, 180);
    }

    tl.add(
      orbitItems,
      { opacity: 1, scale: { from: 0 }, delay: stagger(90), duration: 520, ease: 'outBack' },
      420
    )
      .add(dateEl, { opacity: 1, y: { from: 16 }, duration: 500 }, '-=280')
      .add(
        root,
        {
          scale: 0.88,
          opacity: 0,
          duration: 720,
          ease: 'inCubic',
          onBegin: () => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            fireConfetti(cx, cy, 90);
            if (navigator.vibrate) navigator.vibrate(30);
            onRevealed();
          },
          onComplete: () => {
            setComplete(true);
            onFinished();
          },
        },
        '+=280'
      );

    return () => {
      tl.revert();
    };
  }, [play, onRevealed, onFinished]);

  const className = [
    'intro-reveal',
    !play && 'is-waiting',
    play && 'is-playing',
    complete && 'is-complete',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id="intro-curtain" ref={rootRef} className={className} aria-hidden="true">
      <div className="intro-reveal__mesh" />
      <div className="intro-reveal__grid" />
      <MotionField variant="intro" />
      <Ticker compact />

      <div className="intro-reveal__stage">
        <BrandLockup className="intro-reveal__logo" priority />
        <p className="intro-reveal__eyebrow">{eyebrow}</p>
        <div className="intro-reveal__stamp-wrap">
          <AgencyOrbit />
          <svg className="intro-reveal__draw" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="92" />
          </svg>
          <div className="intro-reveal__stamp">
            <span className="intro-reveal__stamp-num">{EVENT.day}</span>
            <span className="intro-reveal__stamp-label">{EVENT.month}</span>
          </div>
        </div>
        <p className="intro-reveal__date">
          {HEADLINE.main} · {BRAND.group}
        </p>
      </div>
    </div>
  );
}
