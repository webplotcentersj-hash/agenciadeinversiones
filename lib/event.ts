export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
).replace(/\/$/, '');

/** Fecha y hora del evento (zona Argentina). Única fuente de verdad. */
export const EVENT_ISO = '2026-08-21T19:00:00-03:00';
export const EVENT_TIMESTAMP = new Date(EVENT_ISO).getTime();

export const EVENT_HAS_DATE = true;

/**
 * El motivo de la invitación es la INAUGURACIÓN. El aniversario acompaña:
 * aparece como sello chico, nunca como titular.
 */
export const HEADLINE = {
  /** Titular de la portada. */
  main: 'Inauguración',
  /** Bajada: qué se está inaugurando. */
  sub: 'Queremos que veas nuestro nuevo espacio',
  /** Sello secundario del aniversario. */
  badge: '10 años',
} as const;

export const BRAND = {
  group: 'Grupo Agencias',
  years: 10,
  yearsLabel: '10 años',
  since: '2016',
  city: 'San Juan',
  street: 'Ignacio de la Roza',
  /** Logo principal: blanco sobre transparente, pensado para fondo oscuro. */
  logo: { src: '/principal.png?v=3', width: 1600, height: 347 },
} as const;

export const EVENT = {
  day: '21',
  month: 'Ago',
  monthLong: 'agosto',
  year: '2026',
  time: '19:00 hs',
  weekday: 'Viernes',
  address: 'Ignacio de la Roza',
  addressNumber: '237 Oeste',
  addressShort: 'San Juan Capital',
} as const;

export type Agency = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  /** Logo de la agencia: blanco sobre transparente. */
  logo: { src: string; width: number; height: number };
  /** Acento de la tarjeta, dentro de la paleta roja. */
  tone: 'claro' | 'vivo' | 'palido';
  services: string[];
  address: string;
  mapsQuery: string;
};

export const AGENCIES: Agency[] = [
  {
    id: 'inversiones',
    name: 'Agencia de Inversiones',
    logo: { src: '/inversiones.png?v=3', width: 1600, height: 274 },
    tone: 'claro',
    tagline: 'Consultora financiera, minera e inmobiliaria',
    icon: 'fa-chart-line',
    services: [
      'Gestión patrimonial',
      'Asesoramiento financiero integral',
      'Family office',
      'Gestión de carteras',
    ],
    address: 'Ignacio de la Roza 237 Oeste',
    mapsQuery: 'Ignacio de la Roza 237 Oeste, San Juan, Argentina',
  },
  {
    id: 'automotores',
    name: 'Agencia de Automotores',
    logo: { src: '/Automotores.png?v=3', width: 1600, height: 246 },
    tone: 'vivo',
    tagline: 'Invertimos en movimiento, generamos valor',
    icon: 'fa-car',
    services: ['Compra', 'Venta', 'Consignaciones', 'Financiaciones', 'Rental car'],
    address: 'Ignacio de la Roza 307 Oeste',
    mapsQuery: 'Ignacio de la Roza 307 Oeste, San Juan, Argentina',
  },
  {
    id: 'construcciones',
    name: 'Agencia de Construcciones',
    logo: { src: '/constructora.png?v=3', width: 1600, height: 224 },
    tone: 'palido',
    tagline: 'Diseños, inversiones y desarrollos',
    icon: 'fa-helmet-safety',
    services: [
      'Arquitectura y diseño',
      'Construcción y ejecución',
      'Proyectos residenciales, comerciales y corporativos',
      'Desarrollos integrales',
    ],
    address: 'Ignacio de la Roza 1955 Oeste',
    mapsQuery: 'Ignacio de la Roza 1955 Oeste, San Juan, Argentina',
  },
];

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type InviteTipo = 'GENERAL' | 'DISENO';

export const TONE: Record<InviteTipo, { hero: string; eyebrow: string; introEyebrow: string }> = {
  GENERAL: {
    hero: HEADLINE.sub,
    eyebrow: 'Inauguración',
    introEyebrow: 'Te invitamos a la inauguración',
  },
  DISENO: {
    hero: 'Queremos que conozcas el espacio que diseñamos.',
    eyebrow: 'Inauguración',
    introEyebrow: 'Te invitamos a la inauguración',
  },
};

/** Lee ?tipo=diseno de la URL. Mismo criterio que la invitación original. */
export function readInviteTipo(search: string): InviteTipo {
  const raw = new URLSearchParams(search).get('tipo') || 'GENERAL';
  const normalized = raw.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return normalized === 'DISENO' || normalized.startsWith('DISE') ? 'DISENO' : 'GENERAL';
}
