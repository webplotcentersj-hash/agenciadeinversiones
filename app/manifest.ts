import type { MetadataRoute } from 'next';
import { BRAND, EVENT, HEADLINE } from '@/lib/event';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${HEADLINE.main} — ${BRAND.group}`,
    short_name: BRAND.group,
    description: `${EVENT.weekday} ${EVENT.day} de ${EVENT.monthLong} · ${EVENT.time} · ${BRAND.city}`,
    start_url: '/',
    display: 'standalone',
    background_color: '#7C1011',
    theme_color: '#7C1011',
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
  };
}
