/**
 * Motor de confeti y fuegos artificiales.
 * Portado desde la invitación original (index.html) sin cambios de comportamiento.
 */

/** Sólo rojos institucionales y blancos: es lo que se lee sobre el fondo. */
const COLORS = ['#ffffff', '#fff6f3', '#ff9a93', '#e8484b', '#c61014', '#ffd2cb', '#7c1011'];

type ParticleOpts = {
  kind?: 'confetti' | 'spark';
  shape?: 'rect' | 'circle';
  r?: number;
  dx?: number;
  dy?: number;
  color?: string;
  gravity?: number;
  opacity?: number;
  fade?: number;
};

class Particle {
  x: number;
  y: number;
  kind: 'confetti' | 'spark';
  shape: 'rect' | 'circle';
  r: number;
  dx: number;
  dy: number;
  color: string;
  tiltAngle: number;
  tiltAngleInc: number;
  gravity: number;
  opacity: number;
  fade: number;
  rotation: number;
  spin: number;

  constructor(x: number, y: number, burst = false, opts: ParticleOpts = {}) {
    this.x = x;
    this.y = y;
    this.kind = opts.kind || 'confetti';
    this.shape = opts.shape || (Math.random() > 0.5 ? 'rect' : 'circle');
    this.r = opts.r ?? Math.random() * (burst ? 7 : 5) + 2;
    this.dx = opts.dx ?? (Math.random() - 0.5) * (burst ? 14 : 8);
    this.dy = opts.dy ?? Math.random() * (burst ? -14 : -12) - 3;
    this.color = opts.color || COLORS[Math.floor(Math.random() * COLORS.length)];
    this.tiltAngle = Math.random() * Math.PI;
    this.tiltAngleInc = Math.random() * 0.07 + 0.05;
    this.gravity = opts.gravity ?? 0.25 + Math.random() * 0.15;
    this.opacity = opts.opacity ?? 1;
    this.fade = opts.fade ?? 0.005;
    this.rotation = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 10;
  }

  update() {
    this.dy += this.gravity;
    this.x += this.dx;
    this.y += this.dy;
    this.dx *= 0.99;
    this.tiltAngle += this.tiltAngleInc;
    this.rotation += this.spin;
    this.opacity -= this.fade;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity > 0 ? this.opacity : 0;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    if (this.kind === 'spark' || this.shape === 'circle') {
      ctx.shadowBlur = this.kind === 'spark' ? 10 : 0;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.r, -this.r / 2, this.r * 2, this.r);
    }
    ctx.restore();
  }
}

let particles: Particle[] = [];
let ctx: CanvasRenderingContext2D | null = null;
let canvasEl: HTMLCanvasElement | null = null;
let rafId = 0;

function loop() {
  rafId = requestAnimationFrame(loop);
  if (!ctx || !canvasEl) return;
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx);
    if (p.opacity <= 0 || p.y > canvasEl.height + 40) particles.splice(i, 1);
  }
}

function resize() {
  if (!canvasEl) return;
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
}

/** Conecta el motor a un canvas. Devuelve la función de limpieza. */
export function attachConfetti(canvas: HTMLCanvasElement) {
  canvasEl = canvas;
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  loop();
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    particles = [];
    ctx = null;
    canvasEl = null;
  };
}

export function fireConfetti(x: number, y: number, amount = 70) {
  for (let i = 0; i < amount; i++) particles.push(new Particle(x, y, true));
}

export function explodeFirework(x: number, y: number, power = 0.85) {
  const count = Math.floor(36 * power + Math.random() * 18);
  const base = COLORS[Math.floor(Math.random() * COLORS.length)];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
    const speed = (2.5 + Math.random() * 5) * power;
    particles.push(
      new Particle(x, y, true, {
        kind: 'spark',
        shape: 'circle',
        r: 1.2 + Math.random() * 2,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        gravity: 0.04 + Math.random() * 0.05,
        fade: 0.01 + Math.random() * 0.01,
        color: Math.random() > 0.35 ? base : COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    );
  }
}

export function launchFirework(startX: number, startY: number, peakY: number) {
  const rocket = {
    x: startX,
    y: startY,
    peak: peakY,
    dy: -(8 + Math.random() * 3),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    done: false,
  };
  const step = () => {
    if (rocket.done) return;
    rocket.y += rocket.dy;
    rocket.dy += 0.18;
    particles.push(
      new Particle(rocket.x, rocket.y, false, {
        kind: 'spark',
        shape: 'circle',
        r: 1.6,
        dx: (Math.random() - 0.5) * 0.5,
        dy: Math.random() * 1.2,
        gravity: 0.05,
        fade: 0.06,
        color: rocket.color,
      })
    );
    if (rocket.dy >= 0 || rocket.y <= rocket.peak) {
      rocket.done = true;
      explodeFirework(rocket.x, rocket.y, 0.9 + Math.random() * 0.25);
      return;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function celebrateCut(cx: number, cy: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  fireConfetti(cx, cy, 140);
  fireConfetti(cx - w * 0.18, cy, 70);
  fireConfetti(cx + w * 0.18, cy, 70);
  launchFirework(w * 0.5, h * 0.98, h * 0.2);
  setTimeout(() => {
    explodeFirework(w * 0.28, h * 0.3, 0.95);
    explodeFirework(w * 0.72, h * 0.28, 0.95);
  }, 280);
  if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
}
