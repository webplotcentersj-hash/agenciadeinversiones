'use client';

import { animate, createDrawable, createTimeline, stagger } from 'animejs';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * querySelector para anime.js: devuelve [] en vez de null, así un selector que
 * no matchea es un no-op en vez de un error de tipos.
 */
export function target(root: ParentNode, selector: string): Element[] {
  const el = root.querySelector(selector);
  return el ? [el] : [];
}

export { animate, createDrawable, createTimeline, stagger };
