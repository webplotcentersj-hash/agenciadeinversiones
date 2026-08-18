'use client';

import { useCallback, useEffect, useState } from 'react';
import Agencies from '@/components/Agencies';
import AmbientBackground from '@/components/AmbientBackground';
import ConfettiCanvas from '@/components/ConfettiCanvas';
import Countdown from '@/components/Countdown';
import DateCard from '@/components/DateCard';
import Hero from '@/components/Hero';
import IntroCurtain from '@/components/IntroCurtain';
import LocationCard from '@/components/LocationCard';
import NameGate from '@/components/NameGate';
import PatternBanner from '@/components/PatternBanner';
import RsvpFinale from '@/components/RsvpFinale';
import ScrollCue from '@/components/ScrollCue';
import StepArrows, { remainingSteps } from '@/components/StepArrows';
import Ticker from '@/components/Ticker';
import { EVENT_HAS_DATE, TONE, readInviteTipo, type InviteTipo } from '@/lib/event';
import { openRsvp, writeGuestId } from '@/lib/rsvp';
import { useEventStatus } from '@/lib/useEventStatus';

type Phase = 'gate' | 'envelope' | 'stamp' | 'open';

/** Cantidad de secciones que se revelan escalonadamente tras cortar la cinta. */
const FLOW_SECTIONS = EVENT_HAS_DATE ? 4 : 3;

export default function Page() {
  const [tipo, setTipo] = useState<InviteTipo>('GENERAL');
  const [guestName, setGuestName] = useState('');
  const [guestId, setGuestId] = useState('');
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [phase, setPhase] = useState<Phase>('gate');
  const [introDone, setIntroDone] = useState(false);
  const [dustActive, setDustActive] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [staggerStep, setStaggerStep] = useState(0);
  const [rsvpReady, setRsvpReady] = useState(false);
  const eventStatus = useEventStatus();

  useEffect(() => {
    setTipo(readInviteTipo(window.location.search));
  }, []);

  // El CSS depende de clases en <body>; se sincronizan acá.
  // Ojo con la diferencia entre las dos últimas:
  //   is-cut     → se tocó el sobre, la apertura está corriendo (el sobre
  //                sigue en pantalla, así que la portada NO se oculta).
  //   is-revealed → el sello ya pasó y la carta salió: se libera el scroll.
  useEffect(() => {
    const body = document.body;
    body.classList.toggle('is-gate', phase === 'gate');
    body.classList.toggle('is-intro', phase === 'stamp');
    body.classList.toggle('intro-revealed', phase !== 'gate');
    body.classList.toggle('no-scroll', phase !== 'open' || !revealed);
    body.classList.toggle('is-cut', isCut);
    body.classList.toggle('is-revealed', revealed);
  }, [phase, isCut, revealed]);

  const handleOpen = useCallback(async (nombre: string) => {
    const currentTipo = readInviteTipo(window.location.search);
    const guest = await openRsvp(nombre, currentTipo);
    setGuestId(guest.id);
    writeGuestId(guest.id);
    setGuestName(nombre);
    setPhase('envelope');
    setDustActive(true);
  }, []);

  const handleIntroRevealed = useCallback(() => {
    setPhase('open');
    setRevealed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    for (let i = 0; i < FLOW_SECTIONS; i++) {
      setTimeout(() => setStaggerStep((s) => Math.max(s, i + 1)), 160 + i * 200);
    }
  }, []);

  const handleIntroFinished = useCallback(() => setIntroDone(true), []);

  /** El invitado tocó el sobre: arranca la apertura. */
  const handleRequestOpen = useCallback(() => setIsCut(true), []);

  /** El sobre terminó de abrirse: recién ahí entra el sello. */
  const handleOpened = useCallback(() => setPhase('stamp'), []);

  /** La última agencia ya se vio: el cierre entra un instante después. */
  const handleLastAgency = useCallback(() => {
    window.setTimeout(() => setRsvpReady(true), 900);
  }, []);

  const tone = TONE[tipo];

  return (
    <>
      <NameGate done={phase !== 'gate'} onOpen={handleOpen} />

      {(phase === 'stamp' || phase === 'open') && !introDone && (
        <IntroCurtain
          play
          eyebrow={tone.introEyebrow}
          onRevealed={handleIntroRevealed}
          onFinished={handleIntroFinished}
        />
      )}

      <AmbientBackground active={dustActive} />
      <ConfettiCanvas />

      <PatternBanner position="top" />

      <Hero
        tone={tone.hero}
        guestName={guestName}
        isOpen={isCut}
        play={phase === 'envelope' || phase === 'stamp' || phase === 'open'}
        status={eventStatus}
        onRequestOpen={handleRequestOpen}
        onOpened={handleOpened}
      />

      <main
        id="secret-content"
        className={`reveal-after-cut flex-col items-center px-3 sm:px-6 pb-4 sm:pb-8 relative z-10 w-full max-w-4xl mx-auto${
          revealed ? ' is-revealed' : ''
        }`}
      >
        <DateCard guestName={guestName} visible={staggerStep >= 1} />

        <div className="section-connector reveal-stagger hidden sm:block" aria-hidden="true" />

        <LocationCard visible={staggerStep >= 2} />

        <div className="section-connector reveal-stagger hidden sm:block" aria-hidden="true" />

        {EVENT_HAS_DATE && <Countdown visible={staggerStep >= 3} status={eventStatus} />}

        <Agencies
          visible={staggerStep >= (EVENT_HAS_DATE ? 4 : 3)}
          onLastVisible={handleLastAgency}
        />
      </main>

      {rsvpReady && (
        <RsvpFinale
          guestName={guestName}
          guestId={guestId}
          confirmed={rsvpConfirmed}
          onConfirmed={() => setRsvpConfirmed(true)}
        />
      )}

      {revealed && <Ticker />}

      <PatternBanner position="bottom" />

      <StepArrows remaining={remainingSteps(phase, rsvpReady, rsvpConfirmed)} />

      <ScrollCue active={revealed} />
    </>
  );
}
