'use client';

import { useEffect, useRef } from 'react';
import { attachConfetti } from '@/lib/confetti';

export default function ConfettiCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return attachConfetti(ref.current);
  }, []);

  return <canvas ref={ref} id="confetti-canvas" className="fixed inset-0 pointer-events-none z-50" />;
}
