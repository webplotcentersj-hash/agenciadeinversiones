import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { BRAND, EVENT, HEADLINE } from '@/lib/event';

export const runtime = 'nodejs';
export const alt = `Estás invitado a la inauguración de ${BRAND.group} — ${EVENT.weekday} ${EVENT.day} de ${EVENT.monthLong} ${EVENT.year}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const fontsDir = join(process.cwd(), 'fonts');
  const [fraunces, outfit, outfitBold, logo] = await Promise.all([
    readFile(join(fontsDir, 'Fraunces-Bold.ttf')),
    readFile(join(fontsDir, 'Outfit-Medium.ttf')),
    readFile(join(fontsDir, 'Outfit-Bold.ttf')),
    readFile(join(process.cwd(), 'public/principal.png')),
  ]);

  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #C61014 0%, #7C1011 46%, #311413 100%)',
        }}
      >
        <img src={logoSrc} width={760} height={165} />
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontFamily: 'Fraunces',
            fontSize: 68,
            fontWeight: 700,
            color: '#FFF6F3',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {HEADLINE.main}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 32,
            background: '#FFF6F3',
            borderRadius: 28,
            padding: '22px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#C61014',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: 'Fraunces',
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {EVENT.day}
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Outfit',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.28em',
                marginTop: 4,
              }}
            >
              {EVENT.month.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              width: 1,
              height: 68,
              background: 'rgba(198,16,20,0.18)',
              marginLeft: 28,
              marginRight: 28,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Outfit',
                fontSize: 26,
                fontWeight: 700,
                color: '#7C1011',
              }}
            >
              {`${EVENT.weekday} · ${EVENT.time}`}
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Outfit',
                fontSize: 20,
                fontWeight: 500,
                color: '#8a3a38',
                marginTop: 6,
              }}
            >
              {`${EVENT.address} ${EVENT.addressNumber} · ${BRAND.city}`}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 22,
            fontFamily: 'Outfit',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#FF9A93',
          }}
        >
          {BRAND.yearsLabel}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' },
        { name: 'Outfit', data: outfit, weight: 500, style: 'normal' },
        { name: 'Outfit', data: outfitBold, weight: 700, style: 'normal' },
      ],
    }
  );
}
