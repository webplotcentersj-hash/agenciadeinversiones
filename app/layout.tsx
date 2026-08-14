import type { Metadata, Viewport } from 'next';
import { BRAND, EVENT, EVENT_HAS_DATE, HEADLINE, SITE_URL } from '@/lib/event';
import './globals.css';

// El motivo es la inauguración; el aniversario sólo acompaña al final.
const description = EVENT_HAS_DATE
  ? `${HEADLINE.sub}. ${BRAND.group} te invita el ${EVENT.day} de ${EVENT.monthLong} ${EVENT.year} · ${EVENT.time} · ${BRAND.street}, ${BRAND.city}. En el año de nuestros ${BRAND.yearsLabel}.`
  : `${HEADLINE.sub}. ${BRAND.group} en ${BRAND.street}, ${BRAND.city}. Inversiones, automotores y construcciones.`;

const ogDescription = EVENT_HAS_DATE
  ? `${HEADLINE.sub}. ${EVENT.day} · ${EVENT.month.toUpperCase()} · ${EVENT.year} · ${EVENT.time} · ${BRAND.street}, ${BRAND.city}.`
  : `${HEADLINE.sub}. ${BRAND.group} · ${BRAND.street}, ${BRAND.city}.`;

const ogImage = '/og-image.jpg?v=2';
const ogImageAlt = `${HEADLINE.main} — ${BRAND.group}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${HEADLINE.main} — ${BRAND.group}`,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: BRAND.group,
    url: '/',
    title: `${HEADLINE.main} — ${BRAND.group}`,
    description: ogDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${HEADLINE.main} — ${BRAND.group}`,
    description: ogDescription,
    images: [ogImage],
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
