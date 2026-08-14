'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  s: number;
  speed: number;
  drift: number;
  opacity: number;
  kind: 'dot' | 'dash';
};

/**
 * Fondo vivo: manchas de color, grilla y partículas geométricas.
 */
export default function AmbientBackground({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let running = true;
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!particles.length) {
        const count = window.matchMedia('(max-width: 639px)').matches ? 22 : 38;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            s: Math.random() * 4 + 1.5,
            speed: Math.random() * 0.18 + 0.05,
            drift: (Math.random() - 0.5) * 0.15,
            opacity: Math.random() * 0.28 + 0.08,
            kind: Math.random() > 0.65 ? 'dash' : 'dot',
          });
        }
      }
    };

    const animate = () => {
      if (!running) return;
      rafId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -8) {
          p.y = canvas.height + 8;
          p.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#ff9a93';
        if (p.kind === 'dash') {
          ctx.fillRect(p.x, p.y, p.s * 3.2, 1.2);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    };

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      const blobs = sceneRef.current?.querySelectorAll<HTMLElement>('.bg-blob');
      blobs?.forEach((blob, i) => {
        const factor = (i + 1) * 0.35;
        blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
      particles = [];
    };
  }, [active]);

  return (
    <>
      <div ref={sceneRef} className="ambient-bg bg-scene" aria-hidden="true">
        <div className="bg-blob bg-blob--glow" />
        <div className="bg-blob bg-blob--deep" />
        <div className="bg-blob bg-blob--warm" />
        <div className="bg-grid" />
        <div className="bg-horizon" />
      </div>
      <canvas ref={canvasRef} id="dust-canvas" aria-hidden="true" />
    </>
  );
}
