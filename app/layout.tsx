import type { Metadata, Viewport } from 'next';
import { BRAND, EVENT, HEADLINE, SITE_URL } from '@/lib/event';
import './globals.css';

const title = `Estás invitado a la inauguración — ${BRAND.group}`;
const description =
  `Te invitamos a inaugurar nuestro nuevo espacio. ${EVENT.weekday} ${EVENT.day} de ${EVENT.monthLong}, ${EVENT.time}, ${EVENT.address} ${EVENT.addressNumber}, ${BRAND.city}. ${BRAND.yearsLabel} de ${BRAND.group}.`;
const ogTitle = `Estás invitado a la inauguración`;
const ogDescription = `${EVENT.weekday} ${EVENT.day} de ${EVENT.monthLong} · ${EVENT.time} · ${EVENT.address} ${EVENT.addressNumber}, ${BRAND.city}`;
const ogImageAlt = `${HEADLINE.main} de ${BRAND.group} — ${EVENT.weekday} ${EVENT.day} de ${EVENT.monthLong} ${EVENT.year}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: BRAND.group,
  authors: [{ name: BRAND.group }],
  creator: BRAND.group,
  publisher: BRAND.group,
  category: 'event',
  keywords: [
    'inauguración',
    'Grupo Agencias',
    'San Juan',
    'Ignacio de la Roza',
    '10 años',
    'inversiones',
    'automotores',
    'construcciones',
  ],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: {
    capable: true,
    title: BRAND.group,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: BRAND.group,
    url: '/',
    title: ogTitle,
    description: ogDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: ogTitle,
    description: ogDescription,
  },
  other: {
    'og:image:alt': ogImageAlt,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#7C1011',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="is-gate no-scroll selection:bg-brand-500 selection:text-white flex flex-col min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {children}
      </body>
    </html>
  );
}
